import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Internship} from "../../../core/models/internship.model";
import {InternshipsService} from "../../../core/services/Internships/internships.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {AuthenticationService} from "../../../core/services/auth.service";
import {User} from "../../../core/models/auth.models";


@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.scss']
})
export class InternshipDetailsComponent  implements OnInit {
  breadCrumbItems: Array<{}>;
  internshipId: string = '';
  message: string = '';
  internship: Internship | null = null; // Initialize internship as null
  shareUrl: string; // Define shareUrl variable
  user: User;

  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService ,// Inject your InternshipsService
    private http: HttpClient, // Inject HttpClient here
    private authService: AuthenticationService
) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Jobs' }, { label: 'Job Details', active: true }];


    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      this.getInternshipDetails(); // Call method to fetch internship details
    });

    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
    });



  }

  getInternshipDetails(): void {
    this.internshipsService.getInternshipById(+this.internshipId).subscribe(
      (internship: Internship) => {
        this.internship = internship; // Assign fetched internship data to variable
      },
      (error) => {
        console.error('Error fetching internship details:', error);
      }
    );
  }

  openGoogleMaps(): void {
    const location = encodeURIComponent(this.internship.intershipLocation);
    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
  }

// Add this function to share on LinkedIn using the LinkedIn Share API
  shareOnLinkedIn(): void {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;

    // Construct headers with Content-Type as application/x-www-form-urlencoded
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Send a POST request to shareUrl with empty data and headers
    this.http.post(shareUrl, {}, { headers }).subscribe(
      (response) => {
        console.log('Shared successfully:', response);
      },
      (error) => {
        console.error('Error sharing on LinkedIn:', error);
      }
    );
  }
}
