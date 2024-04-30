import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AdditionalUserData } from "../models/additional-user-data.model";

@Injectable({
  providedIn: 'root'
})
export class AdditionalUserDataServiceService {

  private baseUrl = 'http://localhost:8089/profile/additionalUserData';

  constructor(private http: HttpClient) { }

  // POST method to create additional user data
  createAdditionalUserData(additionalUserData: AdditionalUserData): Observable<AdditionalUserData> {
    return this.http.post<AdditionalUserData>(`${this.baseUrl}/Add`, additionalUserData); // Updated endpoint
  }

  // GET method to retrieve additional user data by userId
  getAdditionalUserData(userId: string): Observable<AdditionalUserData> {
    return this.http.get<AdditionalUserData>(`${this.baseUrl}/Get/${userId}`); // Updated endpoint
  }

  // PUT method to update additional user data by userId
  updateAdditionalUserData(userId: string, additionalUserData: AdditionalUserData): Observable<AdditionalUserData> {
    return this.http.put<AdditionalUserData>(`${this.baseUrl}/Edit/${userId}`, additionalUserData); // Updated endpoint
  }

  // DELETE method to delete additional user data by userId
  deleteAdditionalUserData(userId: string): Observable<AdditionalUserData> {
    return this.http.delete<AdditionalUserData>(`${this.baseUrl}/Delete/${userId}`); // Updated endpoint
  }



}
