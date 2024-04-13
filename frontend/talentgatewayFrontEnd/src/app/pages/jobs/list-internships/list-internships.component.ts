import { Component, QueryList, ViewChildren, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import Swal from 'sweetalert2';



import {InternshipsService} from "../../../core/services/Internships/internships.service";

@Component({
  selector: 'app-list-internships',
  templateUrl: './list-internships.component.html',
  styleUrls: ['./list-internships.component.scss'],
})
export class ListInternshipsComponent implements OnInit {
  internships: any[] = [];
  totalRecords: number = 0;
  page: number = 1;
  searchTerm: string = '';
  breadCrumbItems: any[] = [];
  startIndex: number = 0;
  endIndex: number = 0;
  modalRef: BsModalRef;
  jobForm: FormGroup;

  @ViewChild('content') content: TemplateRef<any>;

  constructor(private internshipsService: InternshipsService,  private modalService: BsModalService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getAllInternships();
    this.initJobForm();
  }

  openModal(): void {
    this.modalRef = this.modalService.show(this.content);
  }

  initJobForm(): void {
    this.jobForm = this.formBuilder.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: ['', Validators.required],
      qualifications: ['', Validators.required],
      skills: ['', Validators.required],
      location: ['', Validators.required],
      duration: ['', Validators.required],
      startDate: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  saveJob(): void {
    if (this.jobForm.valid) {
      console.log('Form is valid. Submitting...');

      this.internshipsService.createInternship(this.jobForm.value).subscribe(
        () => {
          console.log('Internship saved successfully.');
          this.modalRef.hide(); // Close the modal
          this.getAllInternships(); // Refresh the list of internships
        },
        (error) => {
          console.error('Error creating internship:', error);
          // Handle error if needed
        }
      );
    } else {
      console.log('Form is invalid.');
      // Handle form validation errors
    }
  }




  updatePagination(): void {
    const startIndex = (this.page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, this.totalRecords);
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  getCurrentPageInternships(): any[] {
    const startIndex = (this.page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, this.totalRecords);
    return this.internships.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.page = event;
  }

  getAllInternships(): void {
    this.internshipsService.getAllInternships().subscribe(
      (data: any[]) => {
        this.internships = data;
        this.totalRecords = this.internships.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
  }

  deleteInternship(id: number): void {
    this.internshipsService.deleteInternship(id).subscribe(
      () => {
        this.getAllInternships();
      },
      (error) => {
        console.error('Error deleting internship:', error);
      }
    );
  }

  deleteInternshipConfirmed(id: number): void {
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
          this.deleteInternship(id);
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

  searchInternships() {

  }




}
