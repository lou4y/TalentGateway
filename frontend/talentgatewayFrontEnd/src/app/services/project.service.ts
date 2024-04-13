import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly API_URL = "http://localhost:8010";
  readonly ENDPOINT_Projects = "/projects";

  constructor(private httpClient: HttpClient) { }

  getAllProjects(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + this.ENDPOINT_Projects);
  }

  addProject(project: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + this.ENDPOINT_Projects, project);
  }

  deleteProject(id: any): Observable<any> {
    return this.httpClient.delete<any>(this.API_URL + this.ENDPOINT_Projects + '/' + id);
  }

  getProjectById(id: any): Observable<any> {
    return this.httpClient.get<any[]>(this.API_URL + this.ENDPOINT_Projects + '/' + id);
  }

  updateProject(project: any): Observable<any> {
    return this.httpClient.put<any>(this.API_URL + this.ENDPOINT_Projects + '/' + project.projectId, project);
  }
}
