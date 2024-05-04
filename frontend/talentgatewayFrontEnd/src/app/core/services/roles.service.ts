import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserVerif} from "../models/UserVerificationData.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = 'http://localhost:8089/keycloak/users'; // Update the base URL

  constructor(private http: HttpClient) { }

  // POST method to create additional user data
  assignRole(userid: string, roleName: string) {
    return this.http.post<UserVerif>(`${this.baseUrl}/${userid}/roles/${roleName}`, {});
  }

}