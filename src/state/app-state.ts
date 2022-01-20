namespace App {
    type Listener<T> = (items: T[]) => void;

class AppState<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }

}

export class ProjectState extends AppState<Project> {
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
        this.updateListeners();
    }
    
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const foundProject = this.projects.find(project=>project.id===projectId);
        if(foundProject && foundProject.status!==newStatus) {
            foundProject.status = newStatus;
            this.updateListeners();
        }
    }
    
    private updateListeners () {
        //this.listeners.forEach(listener=>listener([...this.projects]));
        this.listeners.forEach(listener=>listener(this.projects.slice()));
    }

}

export const projectState = ProjectState.getInstance();
}