/*
Display the form when the class is instantiated
*/
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

    private submitHandler (e: Event) {
        e.preventDefault();
        console.log({
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            people: this.peopleInput.value
        })
    }
    private config() {
        this.docElement.addEventListener('submit', this.submitHandler.bind(this));
    }


    private attachElement() {
        this.hostElement.insertAdjacentElement('afterbegin', this.docElement);
    }
}

new TaskInput();