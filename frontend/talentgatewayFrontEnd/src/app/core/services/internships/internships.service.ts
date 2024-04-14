import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Internship} from "../../models/internship.model";

@Injectable({
  providedIn: 'root'
})
export class InternshipsService {
  readonly API_URL = "http://localhost:8087/api/internships";

  constructor(private httpClient: HttpClient) { }

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
}
