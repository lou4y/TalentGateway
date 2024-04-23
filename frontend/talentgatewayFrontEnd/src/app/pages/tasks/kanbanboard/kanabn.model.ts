// task.model.ts
export interface ModuleInfo {
  id: number;
  moduleName: string;
  moduleDescription: string;
}

export interface TaskKanban  {
  id: number;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  duration?: any; // Could be `null` or `string`
  statut: string; // Your API returns 'statut' not 'status'
  priority: string;
  module: ModuleInfo;
  userId: string;
  firstName: string;
}
