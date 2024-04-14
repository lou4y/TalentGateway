import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Internship} from "../../../core/models/internship.model";
import {InternshipsService} from "../../../core/services/Internships/internships.service";

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

  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService // Inject your InternshipsService
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
}
