/*
Display the form when the class is instantiated
*/
class TaskInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    docElement: HTMLFormElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const docFragment = document.importNode(this.templateElement.content, true);
        this.docElement = <HTMLFormElement>docFragment.firstElementChild;
        this.attachElement();

    }

    private attachElement() {
        this.hostElement.insertAdjacentElement('afterbegin', this.docElement);
    }
}

new TaskInput();