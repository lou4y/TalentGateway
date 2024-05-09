import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Kuser, User} from "../models/auth.models";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:8888/USER-SERVICE/keycloak'
  constructor(private http: HttpClient) { }


  Getallusers(): Observable<Kuser[]> {
    return this.http.get<Kuser[]>(`${this.baseUrl}/users`); // Updated endpoint
  }

  //put method to update user by userId
  updateUser(user: Kuser): Observable<Kuser> {
    return this.http.put<Kuser>(`${this.baseUrl}/user`, user); // Updated endpoint
  }

}
