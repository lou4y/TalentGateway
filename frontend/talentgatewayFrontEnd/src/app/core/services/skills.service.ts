import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Skill} from "../models/skill.model";


@Injectable({
  providedIn: 'root'
})
export class SkillsService {


  private baseUrl = 'http://localhost:8888/USER-SERVICE/profile'; // Update the base URL

  constructor(private http: HttpClient) { }


  getUserSkills(id: string, ) {
    return this.http.get <Skill[]>(`${this.baseUrl}/skills/${id}`, {});
  }
  // POST method to create additional user data
  createSkill(skill: Skill) {
    return this.http.post<Skill>(`${this.baseUrl}/skill`, skill);
  }

  editSkill(skill: Skill) {
    return this.http.put<Skill>(`${this.baseUrl}/skill`, skill);
  }
  deleteSkill(id: string) {
    return this.http.delete(`${this.baseUrl}/skill/${id}`);
  }


}
