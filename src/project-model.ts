namespace App {
  export enum ProjectStatus {
    Active,
    Complete,
  }

  //Project type
  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public numberOfPeople: number,
      public status: ProjectStatus
    ) {}
  }
}
