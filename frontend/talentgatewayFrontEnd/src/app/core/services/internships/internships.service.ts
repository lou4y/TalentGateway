import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Internship} from "../../models/internship.model";

@Injectable({
  providedIn: 'root'
})
export class InternshipsService {
  readonly API_URL = "http://localhost:8087/api/internships";


  // @ts-ignore
  constructor(private httpClient: HttpClient,private  http: HttpClient) { }

  getAllInternships(): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(this.API_URL);
  }

  createInternship(internship: Internship): Observable<Internship> {
    return this.httpClient.post<Internship>(this.API_URL, internship);
  }

  deleteInternship(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.API_URL}/${id}`);
  }

    getInternshipById(id: number): Observable<Internship> {
    return this.httpClient.get<Internship>(`${this.API_URL}/${id}`);
  }

  updateInternship(internship: Internship): Observable<Internship> {
    return this.httpClient.put<Internship>(`${this.API_URL}/${internship.intershipId}`, internship);
  }


  rateInternship(id: string, rating: number, userId: string): Observable<any> {
    // @ts-ignore
    return this.http.post<any>(`${this.API_URL}/${id}/rating`, { rating, userId });
  }


  // New method to get internships by user ID
  getInternshipsByUserId(userId: string): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(`${this.API_URL}/user/${userId}`);
  }


  // New method to share internship on LinkedIn
  shareInternshipOnLinkedIn(id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/${id}/share-linkedin`, {});
  }


// New method to get total number of internships
  getTotalInternshipsCount(): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL}/statistics/total`);
  }

  // New method to get average rating of internships
  getAverageRatingOfInternships(): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL}/statistics/average-rating`);
  }

  // New method to get total number of internships by user ID
  getTotalInternshipsCountByUser(userId: string): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL}/statistics/total-by-user/${userId}`);
  }

}
