import {Component, OnInit} from '@angular/core';
import {Internship} from "../../core/models/internship.model";
import {ActivatedRoute} from "@angular/router";
import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";

@Component({
  selector: 'app-internships-detail',
  templateUrl: './internships-detail.component.html',
  styleUrls: ['./internships-detail.component.scss']
})
export class InternshipsDetailComponent implements OnInit {
  internship: Internship | undefined;
  rating: number = 0; // Variable to store the rating
  user: any; // Assuming you have an AuthService to get user info

  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService,
    private authService: AuthenticationService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.currentUser();
    this.getInternshipDetails();
  }

  getInternshipDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.internshipsService.getInternshipById(id).subscribe(internship => {
      this.internship = internship;
    });
  }

  onRatingChange(rating: number): void {
    // Assuming this.user.id is accessible within the component
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }
    if (!this.internship || !this.internship.intershipId) {
      console.error('Internship details not available');
      return;
    }
    // Assuming this.internshipId and this.rating are accessible within the component
    // @ts-ignore
    this.internshipsService.rateInternship(this.internshipId, this.rating, this.user.id).subscribe(
      (response) => {
        console.log('Rating submitted successfully:', response);
        // Reload the internship details after rating
        this.getInternshipDetails();
      },
      (error) => {
        console.error('Error submitting rating:', error);
      }
    );
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
        // Reload the internship details after rating
        this.getInternshipDetails();
      },
      (error) => {
        console.error('Error submitting rating:', error);
      }
    );
  }
}
