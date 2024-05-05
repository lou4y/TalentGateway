import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/auth.models";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:8089/keycloak/users'
  constructor(private http: HttpClient) { }


  Getallusers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl); // Updated endpoint
  }

}
