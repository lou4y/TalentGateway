import { Component, OnInit } from '@angular/core';
import { ChartType } from './jobs.model';





import { jobViewChart, ApplicationChart, ApprovedChart, RejectedChart, emailSentBarChart, vacancyData, receivedTimeChart, recentJobsData} from './data';
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {User} from "../../../core/models/auth.models";
import {AuthenticationService} from "../../../core/services/auth.service";
import {Internship} from "../../../core/models/internship.model";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})

/**
 * Jobs Component
 */
export class JobsComponent implements OnInit {
  isDropup: boolean = true;
  jobViews: number = 0;
  increase: number = 0;
  internships: any[] = [];

  constructor(private internshipsService: InternshipsService, private authService: AuthenticationService) {
  }

  jobViewChart: ChartType;
  ApplicationChart: ChartType;
  ApprovedChart: ChartType;
  RejectedChart: ChartType;
  emailSentBarChart: ChartType;
  showNavigationArrows: any;
  showNavigationIndicators: any;
  vacancyData: any;
  receivedTimeChart: ChartType;
  recentJobsData: any;

  user: User;

 /* async ngOnInit(): Promise<void> {
    this._fetchData();
    this.fetchStatistics();
    this.user = await this.authService.currentUser();
    if (this.user) {
      this.fetchImagesForInternships(); // Call the image fetching method

      this.getInternshipsByUser(this.user.id.toString()); // Convert to string if needed
    }
  }*/
  async ngOnInit(): Promise<void> {
    this.fetchImagesForInternships();
    this._fetchData();
    this.user = await this.authService.currentUser();
    if (this.user) {
      this.fetchStatisticsByUser(this.user.id.toString()); // Call the statistics fetching method with the user ID
      this.getInternshipsByUser(this.user.id.toString());
    }
  }


  private _fetchData() {
    this.jobViewChart = jobViewChart;
    this.ApplicationChart = ApplicationChart;
    this.ApprovedChart = ApprovedChart;
    this.RejectedChart = RejectedChart;
    this.emailSentBarChart = emailSentBarChart;
    this.vacancyData = vacancyData;
    this.receivedTimeChart = receivedTimeChart;
    this.recentJobsData = recentJobsData;
  }


  fetchStatisticsByUser(userId: string): void {
    this.internshipsService.getTotalInternshipsCountByUser(userId).subscribe((count: number) => {
      this.jobViews = count;
    });

    this.internshipsService.getAverageRatingOfInternships().subscribe((rating: number) => {
      this.increase = rating; // Assuming rating represents the increase percentage
    });
  }



  fetchStatistics() {
    this.internshipsService.getTotalInternshipsCount().subscribe((count: number) => {
      this.jobViews = count;
    });

    this.internshipsService.getAverageRatingOfInternships().subscribe((rating: number) => {
      this.increase = rating; // Assuming rating represents the increase percentage
    });
  }

  getInternshipsByUser(userId: string): void {
    this.internshipsService.getInternshipsByUserId(userId).subscribe(
      (data: Internship[]) => {
        this.internships = data;
        console.log('Internships:', this.internships); // Check if data is populated
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
  }


  /*fetchImagesForInternships(): void {
    console.log('Image fetching initiated.');
    const unsplashAccessKey = 'Tu6jc2QwjhLpbAMvQBajfzRztpv0bOIIxxBNMh9u1yc';
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=cloud&client_id=${unsplashAccessKey}`;

    this.internships.forEach(internship => {
      // Make a direct API call to Unsplash to get a random photo with the query 'cloud'
      fetch(unsplashUrl)
        .then(response => response.json())
        .then(json => {
          const randomImage = json.urls.regular;
          // Check if the internship object has a property named 'image' and it's not already set
          if (internship.hasOwnProperty('image') && !internship.image) {
            // Assign the fetched image URL to the 'image' property of the current internship
            internship.image = randomImage;
            console.log('Internship Image:', randomImage); // Log the image URL
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          console.log('Internship:', internship); // Log the internship object if there's an error
        });
    });
  }*/


  async fetchImagesForInternships(): Promise<void> {
    const unsplashAccessKey = 'Tu6jc2QwjhLpbAMvQBajfzRztpv0bOIIxxBNMh9u1yc';
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=test&client_id=${unsplashAccessKey}`;

    try {
      const response = await fetch(unsplashUrl);
      const json = await response.json();
      const randomImage = json.urls.regular;

      // Assuming Internship model has an 'image' property
      this.internships.forEach(internship => {
        internship.image = randomImage;
      });
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

}
