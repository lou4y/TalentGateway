import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Module } from '../core/models/module.model';
import { Tasks } from '../core/models/task.model'; // Corrected import


@Injectable({
  providedIn: 'root'
})

export class TasksService {

  constructor(private http: HttpClient) { }

 
  public getModules() :Observable<Array<Module>>{
    return this.http.get<Array<Module>>('http://localhost:8015/Modules/GetAllModules');
  }

  createTask(taskData: Tasks): Observable<any> {
    return this.http.post<any>('http://localhost:8015/Tasks/CreateTask', taskData);
  }

  public searchTasks(keyword: string): Observable<Array<Tasks>>{
    const url = `http://localhost:8015/Tasks/search?keyword=${keyword}`;
    console.log('Search URL:', url); // Log the search URL
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  public getAllTasks(skip: number, take: number): Observable<Array<Tasks>> {
    return this.http.get<Array<Tasks>>(`http://localhost:8015/Tasks/GetAllTasks?skip=${skip}&take=${take}`);
  }

  public getTasksByPriority(priority: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByPriority/${priority}`;
    console.log('Filter by Priority URL:', url); // Log the filter by priority URL

    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
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
  
  getTasksByStatus(status: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByStatus/${status}`;
    console.log('Filter by Status URL:', url);
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  getTasksByPriorityAndStatus(priority: string, status: string): Observable<Array<Tasks>> {
    const url = `http://localhost:8015/Tasks/ByPriority/${priority}/ByStatus/${status}`;
    console.log('Filter by Priority and Status URL:', url);
  
    return this.http.get<Array<Tasks>>(url).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  
  

}

