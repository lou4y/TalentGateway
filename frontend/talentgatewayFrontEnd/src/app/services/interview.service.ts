import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8080/api/application'; // Définissez l'URL de base ici
  

  constructor(private http: HttpClient) { }

  getAllApplications(): Observable<any> {
    return this.http.get('http://localhost:8080/api/application/all');
  }


  getAllApplicationsByStatus(status: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/application/all?status=${status}`);
  }

  // Méthode pour rechercher les applications en fonction du terme spécifié
  searchApplications(searchTerm: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/application/search?term=${searchTerm}`);

  }


  deleteApplication(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  createInterview(applicationId: string, interviewData: any) {
    return this.http.post<any>(`http://localhost:8080/api/interview/create/${applicationId}`, interviewData);
  }
  
}
