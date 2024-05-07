import {Component, QueryList, ViewChildren, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';


import {jobGridModel} from './grid.model';
import { JobGridService } from './grid.service';
import { NgbdJobGridSortableHeader, SortEvent } from './grid-sortable.directive';
import firebase from "firebase/compat";
import {User} from "../../../core/models/auth.models";
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {AuthenticationService} from "../../../core/services/auth.service";
import {Internship} from "../../../core/models/internship.model";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {Router} from "@angular/router";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [JobGridService, DecimalPipe]
})


export class GridComponent implements OnInit {

  modalRef?: BsModalRef;
  @ViewChildren(NgbdJobGridSortableHeader) headers!: QueryList<NgbdJobGridSortableHeader>;
  jobGrid$: Observable<jobGridModel[]>;
  total$: Observable<number>;
  public isCollapsed: boolean = true;
  submitted: boolean = false;
  internships: any[] = [];
  // bread crumb items
  breadCrumbItems: Array<{}>;
  total: Observable<number>;
  user: User;
  searchTerm: string = ''; // Add this property for search term

  totalRecords: number = 0;
  page: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;

  constructor(
              private authService: AuthenticationService,
              private internshipsService: InternshipsService,
              private modalService: BsModalService,
              private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.breadCrumbItems = [{ label: 'Jobs' }, { label: 'Jobs Grid', active: true }];
    this.user = await this.authService.currentUser();

    if (this.user) {
      if (this.user.role.includes('admin')) {
        this.getAllInternships();
      } else if (this.user.role.includes('company')) {
        this.getInternshipsByUser(this.user.id.toString());
      }
    }
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  viewInternshipDetails(internshipId: number): void {
    console.log('Internship ID:', internshipId);
    // Navigate to the specific route with the internship ID
    this.router.navigate(['internship-details', internshipId]);
  }


  updatePagination(): void {
    const startIndex = (this.page - 1) * 4;
    const endIndex = Math.min(startIndex + 4, this.totalRecords);
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  getCurrentPageInternships(): Internship[] {
    const startIndex = (this.page - 1) * 4;
    const endIndex = Math.min(startIndex + 4, this.totalRecords);

    // Filter internships based on the search term
    return this.internships
      .filter(internship =>
        internship.intershipTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        internship.intershipCompany.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .slice(startIndex, endIndex);
  }


  pageChanged(event: any): void {
    this.page = event;
  }
  getAllInternships(): void {
    this.internshipsService.getAllInternships().subscribe(
      (data: Internship[]) => {
        this.internships = data;
        this.totalRecords = this.internships.length;
        this.updatePagination();
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

  getInternshipsByUser(userId: string): void {
    this.internshipsService.getInternshipsByUserId(userId).subscribe(
      (data: Internship[]) => {
        this.internships = data;
        this.totalRecords = this.internships.length;
        this.updatePagination();
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



}
