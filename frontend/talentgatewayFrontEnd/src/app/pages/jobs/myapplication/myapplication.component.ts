import { Component, OnInit , ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { InterviewService } from 'src/app/services/interview.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-myapplication',
  templateUrl: './myapplication.component.html',
  styleUrls: ['./myapplication.component.scss'],
})
export class MyapplicationComponent implements OnInit {
  lists: any[] = [];
  totalRecords: number = 0;
  page: number = 1;
  searchTerm: string = '';
  breadCrumbItems: any[] = [];
  startIndex: number = 0;
  endIndex: number = 0;
  modalRef?: BsModalRef;
  submitted: boolean = false;
  jobListForm: FormGroup;
  applicationId: any;
  applicationForm: FormGroup;

  @ViewChild('editApplicationContent') editApplicationContent!: TemplateRef<any>;

  constructor(
    private interviewService: InterviewService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private http: HttpClient // Injection du service HttpClient
  ) {}

  ngOnInit(): void {
    this.getAllApplications();
    this.initForm();
  }

  initForm(): void {
    this.jobListForm = this.formBuilder.group({
      interviewDate: ['', Validators.required],
      interviewTime: ['', Validators.required],
      interviewMode: ['', Validators.required],
    });

    this.applicationForm = this.formBuilder.group({
      status: ['', Validators.required],
      acceptanceDate: ['']
    });
  }

  getAllApplications(): void {
    this.interviewService.getAllApplications().subscribe(
      (data: any[]) => {
        this.lists = data;
        this.totalRecords = this.lists.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  filterApplicationsByStatus(status: string): void {
    this.interviewService.getAllApplicationsByStatus(status).subscribe(
      (data: any[]) => {
        this.lists = data;
        this.totalRecords = this.lists.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching filtered applications by status:', error);
      }
    );
  }

  searchApplications(): void {
    const status = this.searchTerm.toUpperCase();
    if (status === 'ACCEPTED' || status === 'PENDING' || status === 'REJECTED') {
      this.filterApplicationsByStatus(status);
    } else {
      // Handle other cases
    }
  }

  getCurrentPageApplications(): any[] {
    const startIndex = (this.page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, this.totalRecords);
    return this.lists.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.page = event.page;
  }

  updatePagination(): void {
    const startIndex = (this.page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, this.totalRecords);
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  deleteApplication(id: string): void {
    this.interviewService.deleteApplication(id).subscribe(
      (response) => {
        this.getAllApplications();
      },
      (error) => {
        console.error('Error deleting application:', error);
      }
    );
  }

  deleteApplicationConfirmed(id: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          this.deleteApplication(id);
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.applicationId = id;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Create Interview';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    var listData = this.lists.filter((data: { id: any; }) => data.id === id);
  }
  
  saveEdit(applicationId: string): void {
    if (this.jobListForm.invalid) {
      this.submitted = true;
      return;
    }
  
    const interviewDate: string = this.jobListForm.value.interviewDate;
    const interviewTime: string = this.jobListForm.value.interviewTime;
  
    const combinedDateTime: string = interviewDate + ' ' + interviewTime;
  
    const interviewData: any = {
      dateEntretien: combinedDateTime,
      modaliteEntretien: this.jobListForm.value.interviewMode
    };
  
    this.interviewService.createInterview(applicationId, interviewData).subscribe(
      (response) => {
        console.log('Interview created successfully:', response);
        this.jobListForm.reset();
        this.modalRef.hide();
      },
      (error) => {
        console.error('Error creating interview:', error);
      }
    );
  }
  
  editApplication(applicationId: string): void {
    this.submitted = false;
    this.applicationId = applicationId;
    this.modalRef = this.modalService.show(this.editApplicationContent, { class: 'modal-md' });
  }
  
  saveApplication(applicationId: string): void {
    if (this.applicationForm.invalid) {
      this.submitted = true;
      return;
    }
  
    const status = this.applicationForm.value.status;
    const acceptanceDate = this.applicationForm.value.acceptanceDate;
  
    const applicationData = {
      status: status,
      dateAcceptation: acceptanceDate
    };
  
    this.interviewService.updateApplication(applicationId, applicationData).subscribe(
      (response) => {
        console.log('Application updated successfully:', response);
        // Add any additional actions after successful update dateAcceptation
        this.modalRef.hide();
      },
      (error) => {
        console.error('Error updating application:', error);
      }
    );
  }

  getStatusPercentage(status: string): number {
    const totalApplications = this.lists.length;
    const statusCount = this.lists.filter(app => app.status === status).length;
    return (statusCount / totalApplications) * 100;
  }
    
}
