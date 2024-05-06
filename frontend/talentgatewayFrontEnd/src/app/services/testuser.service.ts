import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestuserService {
  readonly API_URL = "http://localhost:8089/keycloak";
  readonly ENDPOINT_Projects = "/users";

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + this.ENDPOINT_Projects);
  }

}
