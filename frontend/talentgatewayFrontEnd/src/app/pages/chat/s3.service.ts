import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private s3UploadUrl = 'http://localhost:8088/aws/upload'; // Your backend API endpoint for image upload

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.s3UploadUrl, formData).pipe(
      map(response => {
        // Assuming the response contains the URL of the uploaded file
        console.log("File uploaded to S3:", response.fileUrl);
        return response.fileUrl;
      })
    );
  }
}
