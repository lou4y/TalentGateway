import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinkedInService {
  private apiUrl = 'http://localhost:8087/api/linkedin'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  shareInternshipOnLinkedIn(internshipUrl: string): void {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(internshipUrl)}`;
    window.open(shareUrl, '_blank');
  }
}
