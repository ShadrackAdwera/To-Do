namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}