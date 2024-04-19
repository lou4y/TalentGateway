import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Internship} from "../../../core/models/internship.model";
import {InternshipsService} from "../../../core/services/Internships/internships.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {AuthenticationService} from "../../../core/services/auth.service";
import {User} from "../../../core/models/auth.models";
import {Observable, throwError} from "rxjs";
import {LinkedInService} from "../../../core/services/internships/linked-in.service";


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


  readonly: boolean = false;
  currentRate: number = 0;
  stepRate: number = 0;
  readRate: number = 0;
  hoverSelect: number = 0;
  customColor: number = 0;
  clearRate: number = 0;
  stepHeart: number = 0;
  x: number = 0;
  y: number = 0;

  intership: Internship | null = null; // Initialize internship as null

  rating: number = 0; // Add a new variable for rating
  intershipId: string = '';
  internshipUrl: string = ''; // Initialize the property with an empty string

  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService,// Inject your InternshipsService
    private http: HttpClient, // Inject HttpClient here
    private authService: AuthenticationService,
    private linkedInService: LinkedInService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.breadCrumbItems = [{label: 'Jobs'}, {label: 'Job Details', active: true}];


    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      this.getInternshipDetails(); // Call method to fetch internship details
    });

    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
    });

    this.user = await this.authService.currentUser()

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


  rateInternship(): void {
    // Make sure the user is authenticated before allowing to rate
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }

    // Assuming this.internshipId and this.rating are accessible within the component
    // @ts-ignore
    this.internshipsService.rateInternship(this.internshipId, this.rating, this.user.id).subscribe(
      (response) => {
        console.log('Rating submitted successfully:', response);
        // Optionally, update the internship details after rating
        this.getInternshipDetails();
      },
      (error) => {
        console.error('Error submitting rating:', error);
      }
    );
  }


 /* shareOnLinkedIn(): void {
    if (!this.internship) {
      console.error('Internship details not available');
      return;
    }
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=http://localhost:4200/internship-details/${this.internshipId}`;

    window.open(shareUrl, '_blank');
  }
*/

  shareOnLinkedIn(): void {
    // Assuming this.internshipId contains the ID of the internship
    const id = this.internshipId; // Replace this with your actual ID variable
console.log(id);
    this.internshipUrl = `http://localhost:4200/internship-details/${id}`;

    this.linkedInService.shareInternshipOnLinkedIn(this.internshipUrl);
  }
}
