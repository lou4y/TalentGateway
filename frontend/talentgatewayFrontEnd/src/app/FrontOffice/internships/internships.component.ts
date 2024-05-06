import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {Internship} from "../../core/models/internship.model";
import {Observable} from "rxjs";

import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgbdJobGridSortableHeader} from "../../pages/jobs/grid/grid-sortable.directive";
import {jobGridModel} from "../../pages/jobs/grid/grid.model";
import {User} from "../../core/models/auth.models";

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {

  filter: {
    FULL_TIME: boolean;
    remote: boolean;
    contract: boolean;
  } = {
    FULL_TIME: false,
    remote: false,
    contract: false
  };


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
    private modalService: BsModalService
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


  updatePagination(): void {
    const startIndex = (this.page - 1) * 4;
    const endIndex = Math.min(startIndex + 4, this.totalRecords);
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  getCurrentPageInternships(): Internship[] {
    const startIndex = (this.page - 1) * 4;
    const endIndex = Math.min(startIndex + 4, this.totalRecords);

    return this.internships
      .filter(internship =>
        (this.searchTerm ? internship.intershipTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) || internship.intershipCompany.toLowerCase().includes(this.searchTerm.toLowerCase()) : true) &&
        (this.filter.FULL_TIME ? internship.intershipType === 'FULL_TIME' : true) &&
        (this.filter.remote ? internship.intershipType === 'REMOTE' : true) &&
        (this.filter.contract ? internship.intershipType === 'CONTRACT' : true)
      )
      .slice(startIndex, endIndex);
  }

  updateInternshipsDisplay(): void {
    this.updatePagination();
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







isInternshipStartDatePassed(startDate: Date): boolean {
    // Implement your logic to check if the internship start date has passed
    return new Date(startDate) < new Date();
  }
}
