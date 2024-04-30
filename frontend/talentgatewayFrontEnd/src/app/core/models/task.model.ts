export interface Tasks {
  id?: number;
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  duration?: string;
  statut?: string;
  priority: string;
  module?: {
    moduleId: number;
    id: number;
    moduleName?: string;
    moduleDescription?: string;
  };
  userId?: number;
  firstName?: string;
}




