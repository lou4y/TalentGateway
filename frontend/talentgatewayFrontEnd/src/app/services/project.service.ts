import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly API_URL = "http://localhost:8888/PROJECT-SERVICE";
  readonly ENDPOINT_Projects = "/projects";
  readonly ENDPOINT_Likes = "/likes";

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


  // Existing methods...

  searchProjects(searchCriteria: string): Observable<any[]> {
    let params = new HttpParams();
    if (searchCriteria) {
      params = params.set('searchCriteria', searchCriteria);
    }
    return this.httpClient.get<any[]>(this.API_URL + this.ENDPOINT_Projects + '/search', { params });
  }

  likeProject(projectId: any, userId: string): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + this.ENDPOINT_Likes + '/like/' + projectId, null, { params: { userId } });
  }


  dislikeProject(projectId: any, userId: string): Observable<any> {
    return this.httpClient.delete<any>(this.API_URL + this.ENDPOINT_Likes + '/dislike/' + projectId, { params: { userId } });
  }

  getNumberOfLikes(projectId: any): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + this.ENDPOINT_Likes + '/count/' + projectId);
  }

  isUserLikedProject(userId: string, projectId: any): Observable<boolean> {
    return this.httpClient.get<boolean>(this.API_URL + this.ENDPOINT_Likes + '/isliked/' + projectId, { params: { userId } });
  }

}
