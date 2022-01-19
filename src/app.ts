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

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {

    }

    static getInstance() : ProjectState {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProjects(title: string, description: string, numberOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, +numberOfPeople, ProjectStatus.Active);
        this.projects.unshift(newProject);
        //this.listeners.forEach(listener=>listener([...this.projects]));
        this.listeners.forEach(listener=>listener(this.projects.slice()));
    }

}

const projectState = ProjectState.getInstance();

class TodoList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    docElement: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'complete') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const docFragment = document.importNode(this.templateElement.content, true);
        this.docElement = <HTMLElement>docFragment.firstElementChild;
        this.docElement.id = `${this.type}-projects`;
        this.assignedProjects = [];

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

        this.attachElement();
        this.renderContent();
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

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.docElement.querySelector('ul')!.id = listId;
        this.docElement.querySelector('h2')!.textContent = `${this.type.toUpperCase()} ITEMS`;

    }

    private attachElement() {
        this.hostElement.insertAdjacentElement('beforeend', this.docElement);
    }
}

class TaskInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    docElement: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const docFragment = document.importNode(this.templateElement.content, true);
        this.docElement = <HTMLFormElement>docFragment.firstElementChild;
        this.docElement.id = 'user-input';
        this.titleInput = <HTMLInputElement>this.docElement.querySelector('#title')!;
        this.descriptionInput = <HTMLInputElement>this.docElement.querySelector('#description')!;
        this.peopleInput = <HTMLInputElement>this.docElement.querySelector('#people')!;

        this.config();
        this.attachElement();

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
    private config() {
        this.docElement.addEventListener('submit', this.submitHandler);
    }


    private attachElement() {
        this.hostElement.insertAdjacentElement('afterbegin', this.docElement);
    }
}

new TaskInput();
new TodoList('active');
new TodoList('complete');