import {Component, OnInit} from '@angular/core';

import {Internship} from "../../core/models/internship.model";
import {Observable} from "rxjs";

import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {
  internships: Internship[] = [];
  user: any;
  totalRecords: number = 0;
  page: number = 1;
  pageSize: number = 3; // Changed to 5 items per page

  constructor(private internshipsService: InternshipsService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    this.getInternships();
  }

  getInternships(): void {
    this.internshipsService.getAllInternships().subscribe(internships => {
      this.internships = internships;
      this.totalRecords = this.internships.length;
    });
  }

  getCurrentPageInternships(): Internship[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    return this.internships.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.page = event;
  }

  isInternshipStartDatePassed(startDate: Date): boolean {
    // Implement your logic to check if the internship start date has passed
    return new Date(startDate) < new Date();
  }
}
