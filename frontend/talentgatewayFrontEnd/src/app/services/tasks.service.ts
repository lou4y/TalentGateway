import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Module, Project } from '../core/models/module.model';
import { Tasks } from '../core/models/task.model'; 
import { User } from '../core/models/auth.models';
import { TaskKanban } from '../pages/tasks/kanbanboard/kanabn.model';


@Injectable({
  providedIn: 'root'
})

export class TasksService {

  constructor(private http: HttpClient) { }

  readonly API_URL = "http://localhost:8888/TASK-SERVICE";
  readonly API_URL_Key = "http://localhost:8888/USER-SERVICE";
  readonly Api_URL_Proj ="http://localhost:8888/PROJECT-SERVICE";

/*
  createTask(taskData: Tasks): Observable<any> {
    return this.http.post<any>('http://localhost:8015/Tasks/CreateTask', taskData);
  }
  */

  // Method to create a task
  createTask(taskData: Tasks): Observable<any> {
    const url = `${this.API_URL}/Tasks/CreateTask`;
    return this.http.post<any>(url, taskData);
  }

/*
  // Method to get all users from the backend
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8089/keycloak/users');
  }
*/

   // Method to get all users
   getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL_Key}/keycloak/users`);
  }

  
/*
  public searchTasks(keyword: string): Observable<Array<Tasks>>{
    const url = `http://localhost:8015/Tasks/search?keyword=${keyword}`;
    console.log('Search URL:', url); // Log the search URL
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  */

  // Method to search for tasks
  public searchTasks(keyword: string): Observable<Array<Tasks>> {
    const url = `${this.API_URL}/Tasks/search?keyword=${keyword}`;
    console.log('Search URL:', url); // Log the search URL

    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }


  /*
  private _getAllTasksForm: FormGroup;
  public getAllTasks(skip: number, take: number): Observable<Array<Tasks>> {
    return this.http.get<Array<Tasks>>(`http://localhost:8015/Tasks/GetAllTasks?skip=${skip}&take=${take}`);
  }
  set getAllTasksForm(taskForm: FormGroup) {
    this._getAllTasksForm = taskForm;
  }
  // Add a getter method if needed
  get getAllTasksForm(): FormGroup {
    return this._getAllTasksForm;
  }
  */

  
  // Method to get all tasks
  public getAllTasks(skip: number, take: number): Observable<Array<Tasks>> {
    const url = `${this.API_URL}/Tasks/GetAllTasks?skip=${skip}&take=${take}`;
    return this.http.get<Array<Tasks>>(url);
  }


  /*
  public getTasksByPriority(priority: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByPriority/${priority}`;
    console.log('Filter by Priority URL:', url); // Log the filter by priority URL

    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  */

  // Method to get tasks by priority
  public getTasksByPriority(priority: string): Observable<Array<Tasks>> {
    const url = `${this.API_URL}/Tasks/ByPriority/${priority}`;
    console.log('Filter by Priority URL:', url); // Log the filter by priority URL

    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  /* not used in any place
  public getTasksSortedByStartDate(): Observable<Array<Tasks>> {
    const url = 'http://localhost:8015/Tasks/SortedByDate';
    console.log('Sort by Date URL:', url); // Log the sort by date URL
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        console.error('Error calling API:', err); // Log API call error
        return throwError(err);
      })
    );
  }
  */

  /*
  getTasksByStatus(status: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByStatus/${status}`;
    console.log('Filter by Status URL:', url);
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  */

  // Method to get tasks by status
  getTasksByStatus(status: string): Observable<Array<Tasks>> {
    const url = `${this.API_URL}/Tasks/ByStatus/${status}`;
    console.log('Filter by Status URL:', url);

    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  /* not used in any place
  getTasksByPriorityAndStatus(priority: string, status: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByPriority/${priority}/ByStatus/${status}`;
    console.log('Filter by Priority and Status URL:', url);
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  */

  /*
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8015/Tasks/DeleteTask/${taskId}`);
  }
  */

  // Method to delete a task
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/Tasks/DeleteTask/${taskId}`);
  }
  
  /*
  updateTask(taskId: number, updatedTask: Tasks): Observable<any> {
    return this.http.put<any>(`http://localhost:8015/Tasks/Update/${taskId}`, updatedTask).pipe(
      catchError(err => {
        console.error('Error updating task:', err); // Log API call error
        return throwError(err);
      })
    );
  }
  */

  // Method to update a task
  updateTask(taskId: number, updatedTask: Tasks): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/Tasks/Update/${taskId}`, updatedTask).pipe(
      catchError(err => {
        console.error('Error updating task:', err); // Log API call error
        return throwError(err);
      })
    );
  }

  /*
  Save_Task_On_DragDrop(taskId: number, updatedTask: TaskKanban): Observable<any> {
    return this.http.put<any>(`http://localhost:8015/Tasks/Update/${taskId}`, updatedTask).pipe(
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Error updating task'));
      })
    );
  }
  */

   // Method to update a task for Kanban
   Save_Task_On_DragDrop(taskId: number, updatedTask: TaskKanban): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/Tasks/Update/${taskId}`, updatedTask).pipe(
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Error updating task'));
      })
    );
  }
  


   /*
  public getModules() :Observable<Array<Module>>{
    return this.http.get<Array<Module>>('http://localhost:8015/Modules/GetAllModules');
    
  }
*/
  
   // Method to get all modules
   public getModules(): Observable<Array<Module>> {
    const url = `${this.API_URL}/Modules/GetAllModules`;
    return this.http.get<Array<Module>>(url);
  }


  /*
  createModule(moduleData: Module): Observable<any> {
    return this.http.post<any>('http://localhost:8015/Modules', moduleData);
  }
  */

  // Method to create a module
  createModule(moduleData: Module): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/Modules`, moduleData);
  }


/*
  private baseUrl = 'http://localhost:8010';
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }
  */

   // Method to get all projects
   getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.Api_URL_Proj}/projects`);
  }
 
  /*
  private getbyuseridUrl = 'http://localhost:8015/Tasks/ByUserId'; // Adjust as necessary
  // In your TasksService
  getTasksByUserId(userId: string): Observable<TaskKanban[]> {
  // Make sure to use the correct URL that corresponds to your backend API
  return this.http.get<TaskKanban[]>(`${this.getbyuseridUrl}/${userId}`);
}
*/


// Method to get tasks by user ID
getTasksByUserId(userId: string): Observable<TaskKanban[]> {
  const url = `${this.API_URL}/Tasks/ByUserId/${userId}`;
  return this.http.get<TaskKanban[]>(url);
}


getTaskStatsByUserId(userId: string): Observable<any> {
  return this.http.get(`${this.API_URL}/Tasks/user/${userId}/stats`);
}

}

