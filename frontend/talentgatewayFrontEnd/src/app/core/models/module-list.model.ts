export interface Project {
    projectId: number;
    projectName: string;

  }
  
export interface Module {
    id?: number; // This is optional
    moduleId: number;
    moduleName: string;
    moduleDescription: string;
    projectId: number; // If you still need this for some reason
    project: Project; // This represents the nested project object
  }
  