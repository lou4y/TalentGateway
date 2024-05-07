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

  vacancyData: any;
  receivedTimeChart: ChartType;
  recentJobsData: any;

  user: User;



  isActive: string = 'week'; // Initial active tab


  async ngOnInit(): Promise<void> {
    this.fetchImagesForInternships();
    this._fetchData();
    this.loadEmailStatistics();
    this.user = await this.authService.currentUser();
    if (this.user) {
      if (this.user.role.includes('admin'))
      { this.getAllInternships();
        this.fetchStatistics();
      }else if (this.user.role.includes('company')) {
        this.fetchStatisticsByUser(this.user.id.toString()); // Call the statistics fetching method with the user ID
        this.getInternshipsByUser(this.user.id.toString());
      }

    }
  }


  getAllInternships(): void {
    this.internshipsService.getAllInternships().subscribe(
      (data: any[]) => {
        this.internships = data;
        // Log the categories for each internship
        this.internships.forEach(internship => {
          console.log('Categories for Internship:', internship.categories);
        });
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
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


  fetchStatistics(): void {
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





  async fetchImagesForInternships(): Promise<void> {
    const unsplashAccessKey = 'Tu6jc2QwjhLpbAMvQBajfzRztpv0bOIIxxBNMh9u1yc';
    const query = 'microsoft';
    //get
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashAccessKey}`;
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





  /*async fetchImagesForInternships(): Promise<void> {
    const unsplashAccessKey = 'Tu6jc2QwjhLpbAMvQBajfzRztpv0bOIIxxBNMh9u1yc';
    const defaultImage = 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg';
    const fallbackQuery = "cloud"; // A common fallback that returns results

    if (this.internships.length === 0) {
      console.log('No internships to fetch images for');
      return;
    }

    for (const internship of this.internships) {
      let imageUrl = await this.fetchImageFromUnsplash(internship.intershipTitle, unsplashAccessKey);
      if (!imageUrl) {
        imageUrl = await this.fetchImageFromUnsplash(fallbackQuery, unsplashAccessKey);  // Use fallback query if no image was found
      }
      internship.image = imageUrl || defaultImage;
    }

    this.internships = [...this.internships]; // Update state to trigger UI refresh
  }

  async fetchImageFromUnsplash(query: string, apiKey: string): Promise<string | null> {
    const encodedQuery = encodeURIComponent(query);
    const url = 'https://api.unsplash.com/photos/random?query=${encodedQuery}&client_id=${apiKey}';
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json && json.urls && json.urls.regular ? json.urls.regular : null;
    } catch (error) {
      console.error('Error fetching image for query:', query, error);
      return null;
    }
  }*/


  loadEmailStatistics() {
    this.internshipsService.getEmailsSentPerInternship().subscribe(
      (data) => {
        // Assuming data is in the format { internshipId: emailsSentCount }
        // You can process the data here and update your chart object accordingly
        this.emailSentBarChart = {
          chart: { /* Chart options */ },
          series: [{ name: 'Emails Sent', data: Object.values(data) }],
          legend: { /* Legend options */ },
          colors: ['#36a2eb'],
          fill: { /* Fill options */ },
          dataLabels: { /* Data labels options */ },
          xaxis: { /* X-axis options */ },
          plotOptions: { /* Plot options */ }
        };
      },
      (error) => {
        console.error('Error fetching email statistics:', error);
      }
    );
  }

  // Methods for switching tabs and reloading data
  weeklyreport() {
    this.isActive = 'week';
    this.loadEmailStatistics();
  }

  monthlyreport() {
    this.isActive = 'month';
    this.loadEmailStatistics();
  }

  yearlyreport() {
    this.isActive = 'year';
    this.loadEmailStatistics();
  }


}
