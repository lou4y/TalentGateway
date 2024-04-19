import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8081/api/application'; // Définissez l'URL de base ici
  

  constructor(private http: HttpClient) { }

  getAllApplications(): Observable<any> {
    return this.http.get('http://localhost:8081/api/application/all');
  }


  getAllApplicationsByStatus(status: string): Observable<any> {
    return this.http.get(`http://localhost:8081/api/application/all?status=${status}`);
  }

  // Méthode pour rechercher les applications en fonction du terme spécifié
  searchApplications(searchTerm: string): Observable<any> {
    return this.http.get(`http://localhost:8081/api/application/search?term=${searchTerm}`);

  }


  deleteApplication(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  createInterview(applicationId: string, interviewData: any) {
    return this.http.post<any>(`http://localhost:8081/api/interview/create/${applicationId}`, interviewData);
  }

  
  updateApplication(id: string, applicationData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, applicationData);
  }

  
 // Nouvelle méthode pour récupérer les applications de l'utilisateur spécifié par userId
 getUserApplications(userId: string): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8081/api/application/myapp/' + userId);
}
// Méthode pour récupérer les données d'interview
getInterviewData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/interviews`);
}

}