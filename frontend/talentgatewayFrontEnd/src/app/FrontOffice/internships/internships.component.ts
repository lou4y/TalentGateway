import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Internship} from "../../core/models/internship.model";
import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {
  internships$: Observable<Internship[]>; // Observable to hold the list of internships
  user: any; // Assuming you have an AuthService to get user info

  constructor(private internshipsService: InternshipsService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    this.getInternships();
    // Call method to fetch all internships
  }

  getInternships(): void {
    this.internships$ = this.internshipsService.getAllInternships();
  }

  // Method to check if the internship start date is less than the current system date
  isInternshipStartDatePassed(internshipStartDate: Date): boolean {
    const currentDate = new Date();
    return currentDate > new Date(internshipStartDate);
  }
}
