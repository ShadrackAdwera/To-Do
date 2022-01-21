import { Draggable } from '../models/drag-drop-interfaces';
import { Component } from './app-component';
import { Project } from '../models/project-model';
import { Autobind } from '../decorators/autobind';


    export class TodoItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
        private project: Project;
        constructor(hostId: string, project: Project) {
            super('single-project',hostId, false, project.id);
            this.project = project;
            this.config();
            this.renderContent();
        }
    
        @Autobind
        dragStartHandler(event: DragEvent): void {
            event.dataTransfer?.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }
    
        @Autobind
        dragEndHandler(_event: DragEvent): void {
            console.log('Drag ends here');
        }
    
        config(): void {
            this.docElement.addEventListener('dragstart', this.dragStartHandler);
            this.docElement.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent(): void {
            this.docElement.querySelector('h2')!.textContent = this.project.title;
            this.docElement.querySelector('h3')!.textContent = `${this.project.numberOfPeople===1? `${this.project.numberOfPeople} person assigned` : `${this.project.numberOfPeople} people assigned`}`;
            this.docElement.querySelector('p')!.textContent = this.project.description;
            
        }
}