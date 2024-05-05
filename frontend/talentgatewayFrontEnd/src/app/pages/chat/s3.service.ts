import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private s3UploadUrl = 'http://localhost:8088/api/upload'; // Your backend API endpoint for image upload

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.s3UploadUrl, formData);
  }
}
