import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly API_URL = "http://localhost:8888/PROJECT-SERVICE";
  readonly ENDPOINT_Projects = "/projects";
  readonly ENDPOINT_Likes = "/likes";
  readonly ENDPOINT_Teams = "/teams";
  constructor(private httpClient: HttpClient) { }

  getAllProjects(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + this.ENDPOINT_Projects);
  }
  deleteTeamMember(teamId: number, userId: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.API_URL + this.ENDPOINT_Teams}/${teamId}/members/${userId}`
    );
  }

  addProject(project: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + this.ENDPOINT_Projects, project);
  }
 // Corrected Angular Service for Multipart Request
  // Do not manually set Content-Type for multipart requests
addProjectWithFile(projectData: any, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('project', JSON.stringify(projectData)); // Add project data
  if (file) {
    formData.append('projectFile', file); // Attach the file
  }

  // Angular handles Content-Type for FormData, so don't set it explicitly
  return this.httpClient.post<any>(
    `${this.API_URL}${this.ENDPOINT_Projects}`,
    formData // No manual Content-Type setting
  );
}



  /*addProjectWithFile(project: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('project', JSON.stringify(project));

    if (file) {
      formData.append('projectFile', file);
    }

    return this.httpClient.post<any>(`${this.API_URL}/projects`, formData);
  }*/

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

  likeProject(projectId: any, userId: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + this.ENDPOINT_Likes + '/like/' + projectId, null, { params: { userId } });
  }


  dislikeProject(projectId: any, userId: any): Observable<any> {
    return this.httpClient.delete<any>(this.API_URL + this.ENDPOINT_Likes + '/dislike/' + projectId, { params: { userId } });
  }

  getNumberOfLikes(projectId: any): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + this.ENDPOINT_Likes + '/count/' + projectId);
  }

  isUserLikedProject(userId: any, projectId: any): Observable<boolean> {
    return this.httpClient.get<boolean>(this.API_URL + this.ENDPOINT_Likes + '/isliked/' + projectId, { params: { userId } });
  }
  getAllLikes(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL+ this.ENDPOINT_Likes + '/all');
  }

}
