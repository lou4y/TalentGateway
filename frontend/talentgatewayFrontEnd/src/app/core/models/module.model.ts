export interface Project {
    projectId: number;
    projectName: string;
    projectDescription: string;
    startDate: Date;
    endTime: Date;
    price: number;
  }
  
  export interface Module {
    moduleId: number;
    moduleName: string;
    moduleDescription: string;
    projectId: number; // If you still need this for some reason
    project: Project; // This represents the nested project object
  }
  