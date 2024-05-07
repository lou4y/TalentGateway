import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private s3UploadUrl = 'http://localhost:8888/MESSAGING-SERVICE/aws/upload'; // Your backend API endpoint for image upload
  private s3DownloadUrl = 'http://localhost:8888/MESSAGING-SERVICE/aws/download'; // Your backend API endpoint for file download

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

  getFile(fileName: string): Observable<any> {
    // Determine if the file is an image or not based on the file name or file extension
    const isImage = this.isImageFile(fileName);

    // Set appropriate content type for the request
    const headers = new HttpHeaders().set('Accept', isImage ? 'image/*' : 'application/octet-stream');

    // Set parameters for the request
    const params = new HttpParams().set('fileName', fileName);

    // Make the HTTP request to download the file
    return this.http.get(this.s3DownloadUrl, { headers: headers, params: params, responseType: 'blob' }).pipe(
      map((response: any) => {
        // Check if the response is an image or a file
        if (isImage) {
          // If it's an image, create an object URL from the blob and return it
          return URL.createObjectURL(response);
        } else {
          // If it's a file, create a blob and return it
          return new Blob([response], { type: 'application/octet-stream' });
        }
      })
    );
  }

  private isImageFile(fileName: string): boolean {
    // You can implement your logic here to determine if the file is an image based on the file name or extension
    // For simplicity, let's assume we're checking if the file name ends with a common image extension
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = fileName.split('.').pop();
    return imageExtensions.includes(extension.toLowerCase());
  }
}
