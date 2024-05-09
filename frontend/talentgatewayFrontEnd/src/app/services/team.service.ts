import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  readonly API_URL = "http://localhost:8888/PROJECT-SERVICE";
  readonly ENDPOINT_TEAMS = "/teams";
  private readonly API_URL_SMS = 'http://localhost:8888/PROJECT-SERVICE/api/v1/sms';

  constructor(private http: HttpClient) { }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + this.ENDPOINT_TEAMS);
  }
  sendSms(phoneNumber: string, message: string): Observable<void> {
    const smsRequest = {
      phoneNumber,
      message
    };

    return this.http.post<void>(this.API_URL_SMS, smsRequest).pipe(
      catchError((error) => {
        console.error('Error sending SMS:', error);
        throw error;
      })
    );
  }
  addTeamMemberToProject(
    projectId: number,
    userId: string,
    memberRole: string
  ): Observable<string> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('userId', userId)
      .set('memberRole', memberRole);

    return this.http.post<string>(
      this.API_URL + this.ENDPOINT_TEAMS + '/add-member',
      {},
      {
        params,
        responseType: 'text' as 'json', // Accept text response
      }
    ).pipe(
      catchError((error) => {
        console.error('Error adding team member:', error);
        throw error;
      })
    );
  }


}
