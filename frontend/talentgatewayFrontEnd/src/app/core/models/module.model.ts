export interface Project {
  projectId: number;
  projectName: string;

}

export interface Module {
  moduleId: any;
  moduleName: string;
  moduleDescription: string;
  projectId: number; // If you still need this for some reason
  projectName: string; // Add this line to include projectName
  project: Project; // This represents the nested project object
}

