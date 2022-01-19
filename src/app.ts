/*
Display the form when the class is instantiated
*/

enum ProjectStatus { Active, Complete }

//Project type
class Project {

    constructor(public id: string, public title: string, public description: string, public numberOfPeople: number, public status: ProjectStatus) {}
}

function Autobind(_target: any, _methodName: string | Symbol, descriptor: PropertyDescriptor) {
    const originalDescriptor = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalDescriptor.bind(this);
        }
    }
    return newDescriptor; 
}

type Listener<T> = (items: T[]) => void;

class AppState<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }

}

class ProjectState extends AppState<Project> {
    private static instance: ProjectState;
    private projects: Project[] = [];
    private constructor() {
        super();
     }

    static getInstance() : ProjectState {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProjects(title: string, description: string, numberOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, +numberOfPeople, ProjectStatus.Active);
        this.projects.unshift(newProject);
        //this.listeners.forEach(listener=>listener([...this.projects]));
        this.listeners.forEach(listener=>listener(this.projects.slice()));
    }

}

const projectState = ProjectState.getInstance();

//Component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    docElement: U;

    constructor(templateId: string, hostId: string, insertAtStart: boolean, newElementId?: string) {
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
        this.hostElement = <T>document.getElementById(hostId)!;

        const docFragment = document.importNode(this.templateElement.content, true);
        this.docElement = <U>docFragment.firstElementChild;

        this.docElement.id = newElementId?? '';
        // if(newElementId) {
        // }

        this.attachElement(insertAtStart);
    }

    attachElement(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(insertAtStart? 'afterbegin' : 'beforeend', this.docElement);
    }
    abstract renderContent() : void;
    abstract config() : void;

}

class TodoList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'complete') {
        super('project-list','app',false, `${type}-projects`);
        this.assignedProjects = [];

        this.config();
        this.renderContent();
    }

    config(): void {
        projectState.addListener((projects: Project[])=>{
            const filteredItems = projects.filter(project=>{
                if(this.type === 'active') {
                   return project.status===ProjectStatus.Active;
                }
                return project.status===ProjectStatus.Complete;
            });
            this.assignedProjects = filteredItems;
            this.renderProjects();
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.docElement.querySelector('ul')!.id = listId;
        this.docElement.querySelector('h2')!.textContent = `${this.type.toUpperCase()} ITEMS`;

    }

    private renderProjects() {
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-projects-list`)!;
        listEl.innerHTML = '';
        this.assignedProjects.forEach(assignedProject=>{
            const listItem = document.createElement('li');
            listItem.textContent = assignedProject.title;
            listEl?.appendChild(listItem); 
        });
    }
}

class TaskInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        super('project-input','app', true, 'user-input');
        this.titleInput = <HTMLInputElement>this.docElement.querySelector('#title')!;
        this.descriptionInput = <HTMLInputElement>this.docElement.querySelector('#description')!;
        this.peopleInput = <HTMLInputElement>this.docElement.querySelector('#people')!;

        this.config();

    }

    renderContent(): void {
        
    }

    config() {
        this.docElement.addEventListener('submit', this.submitHandler);
    }
    private clearForm() : void {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }

    private fetchUserInput() : [string, string,  number] | void {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const people = this.peopleInput.value;

        if(title.trim().length === 0 || description.trim().length === 0 || people.trim().length === 0) {
            alert('Invalid inputs');
            return;
        } else {
            return [title, description, +people];
        }
    }

    @Autobind
    private submitHandler (e: Event) {
        e.preventDefault();
        const userInput = this.fetchUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc, ppo] = userInput;
            projectState.addProjects(title, desc, +ppo);
        }
        this.clearForm();
    }
}

new TaskInput();
new TodoList('active');
new TodoList('complete');