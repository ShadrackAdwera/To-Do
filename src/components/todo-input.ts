namespace App {
    export class TodoInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}