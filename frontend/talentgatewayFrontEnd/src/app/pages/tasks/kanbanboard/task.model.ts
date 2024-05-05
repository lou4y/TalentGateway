export interface Tasks {
    id?: number;
    taskName: string;
    taskDescription?: string;
    module?: {
      moduleId: number;
      id: number;
      moduleName?: string;
      moduleDescription?: string;
    };
    userId?: number;
    firstName?: string;
  }
  
  
  
  
  