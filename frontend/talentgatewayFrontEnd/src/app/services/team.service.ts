import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  readonly API_URL = "http://localhost:8010";
  readonly ENDPOINT_Projects = "/teams";

  constructor(private http: HttpClient) { }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + this.ENDPOINT_Projects);
  }
}
