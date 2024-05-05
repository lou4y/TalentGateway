import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Kuser, User} from "../models/auth.models";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:8089/keycloak'
  constructor(private http: HttpClient) { }


  Getallusers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`); // Updated endpoint
  }

  //put method to update user by userId
  updateUser(user: Kuser): Observable<Kuser> {
    return this.http.put<Kuser>(`${this.baseUrl}/user`, user); // Updated endpoint
  }

}
