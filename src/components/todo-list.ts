namespace App {
    export class TodoList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
        assignedProjects: Project[];
    
        constructor(private type: 'active' | 'complete') {
            super('project-list','app',false, `${type}-projects`);
            this.assignedProjects = [];
    
            this.config();
            this.renderContent();
        }
    
        @Autobind
        dragOverHandler(event: DragEvent): void {
            if(event.dataTransfer && event.dataTransfer.types[0]==='text/plain') {
                event.preventDefault();
                const listEl = this.docElement.querySelector('ul');
                listEl?.classList.add('droppable');
            }
        }
    
        @Autobind
        dropHandler(event: DragEvent): void {
            const projectId = event.dataTransfer!.getData('text/plain');
            projectState.moveProject(projectId, this.type==='active'? ProjectStatus.Active : ProjectStatus.Complete);
        }
    
        @Autobind
        dragLeaveHandler(_event: DragEvent): void {
            const listEl = this.docElement.querySelector('ul');
            listEl?.classList.remove('droppable');
    
        }
    
        config(): void {
            this.docElement.addEventListener('dragover', this.dragOverHandler);
            this.docElement.addEventListener('dragleave', this.dragLeaveHandler);
            this.docElement.addEventListener('drop', this.dropHandler);
    
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
                new TodoItem(this.docElement.querySelector('ul')!.id , assignedProject);
                // const listItem = document.createElement('li');
                // listItem.textContent = assignedProject.title;
                // listEl?.appendChild(listItem); 
            });
        }
    }
}