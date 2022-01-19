/*
Display the form when the class is instantiated
*/

interface Project {
    id: string,
    title: string;
    description: string;
    numberOfPeople: number
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

class ProjectState {
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

    addProjects({ id, title, description, numberOfPeople }: Project) {
        const newProject = {
            id, title, description, numberOfPeople }
        this.projects.unshift(newProject);
    }

}

const projectState = ProjectState.getInstance();

class TodoList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    docElement: HTMLElement;

    constructor(private type: 'active' | 'complete') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const docFragment = document.importNode(this.templateElement.content, true);
        this.docElement = <HTMLElement>docFragment.firstElementChild;
        this.docElement.id = `${this.type}-projects`;

        this.attachElement();
        this.renderContent();
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
            projectState.addProjects({id: Math.random().toString(),title, description: desc, numberOfPeople: +ppo});
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