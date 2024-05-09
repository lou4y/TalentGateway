import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserVerif } from "../models/UserVerificationData.model"; // Assuming the model name is AdditionalUserData

@Injectable({
  providedIn: 'root'
})
export class ProfileVerificationService {

  private baseUrl = 'http://localhost:8888/USER-SERVICE/profile/userVerif'; // Update the base URL

  constructor(private http: HttpClient) { }

  // POST method to create additional user data
  createUserVerification(userVerif: UserVerif): Observable<UserVerif> {
    return this.http.post<UserVerif>(`${this.baseUrl}/Add`, userVerif);
  }

  // GET method to retrieve additional user data by userId
  getUserVerification(userId: string): Observable<UserVerif> {
    return this.http.get<UserVerif>(`${this.baseUrl}/Get/${userId}`);
  }

  // PUT method to update additional user data by userId
  updateUserVerification(userVerif: UserVerif): Observable<UserVerif> {
    return this.http.put<UserVerif>(`${this.baseUrl}/Edit`, userVerif);
  }

  // DELETE method to delete additional user data by userId
  deleteUserVerification(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Delete/${userId}`);
  }
}
