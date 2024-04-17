import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  readonly API_URL = "http://localhost:8888/PROJECT-SERVICE";
  readonly ENDPOINT_Comments = "/comments";

  constructor(private httpClient: HttpClient) { }
  getCommentById(projectId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.API_URL + this.ENDPOINT_Comments + '/' + projectId);
  }

  addComment(comment: any, projectId:any, userId: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + this.ENDPOINT_Comments, comment, { params: { projectId, userId } });
  }
  
}
