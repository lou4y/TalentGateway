import { Component, QueryList, ViewChildren, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import Swal from 'sweetalert2';




import {Router} from "@angular/router";
import {User} from "../../../core/models/auth.models";
import {AuthenticationService} from "../../../core/services/auth.service";
import {Internship} from "../../../core/models/internship.model";
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {AddTeamComponent} from "../../../FrontOffice/projects/add-team/add-team.component";
import {UpdateInternshipComponent} from "../update-internship/update-internship.component";
import {MatDialog} from "@angular/material/dialog";

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
  isEditMode = false;
  selectedinternships: Internship | null = null;
  internshipData: Internship | null = null; // For storing the currently edited internship

  user: User;
  @ViewChild('content') content: TemplateRef<any>;

  constructor(private authService: AuthenticationService, private internshipsService: InternshipsService, private modalService: BsModalService, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    /*this.getAllInternships();*/
    this.initJobForm();

    this.user = await this.authService.currentUser();
    if (this.user) {
      if (this.user.role.includes('admin')) {
        this.getAllInternships();
      } else if (this.user.role.includes('company')) {
        this.getInternshipsByUser(this.user.id.toString());
      }
    }
  }


  openModal(): void {
    this.modalRef = this.modalService.show(this.content);
  }

  initJobForm(): void {

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
        console.log('Internships:', this.internships); // Check if data is populated
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
    if (this.searchTerm.trim() !== '') {
      const searchTermLowerCase = this.searchTerm.toLowerCase();
      this.internships = this.internships.filter(internship => {
        const title = internship.intershipTitle || '';
        const company = internship.intershipCompany || '';
        return title.toLowerCase().includes(searchTermLowerCase) ||
          company.toLowerCase().includes(searchTermLowerCase);
      });
    } else {
      // If search term is empty, reset the internships list
      this.getInternshipsByUser(this.user.id.toString());
    }
  }



  viewInternshipDetails(internshipId: number): void {
    console.log('Internship ID:', internshipId);
    // Navigate to the specific route with the internship ID
    this.router.navigate(['internship-details', internshipId]);
  }








  getInternshipsByUser(userId: string): void {
    this.internshipsService.getInternshipsByUserId(userId).subscribe(
      (data: Internship[]) => {
        this.internships = data;
        this.totalRecords = this.internships.length;
        this.updatePagination();
        console.log('Internships:', this.internships); // Check if data is populated
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
  }

  saveJob() {

  }

  edit(internship: Internship): void {
    this.selectedinternships = { ...internship };
    this.isEditMode = true;
  }
//edit
  openUpdateInternshipDialog(internshipId: number): void {
    this.dialog.open(UpdateInternshipComponent, {
      width: '550px',
      data: { internshipId } // Pass the internshipId to the dialog component
    });
  }
  editDataGet(internshipId: any, content: any) {
    console.log('Editing Internship ID:', internshipId);
    this.modalRef = this.modalService.show(content, {class: 'modal-md'});
    const modelTitle = document.querySelector('.modal-title') as HTMLHeadingElement;
    modelTitle.innerHTML = 'Edit Internship';
    const updateBtn = document.getElementById('add-btn') as HTMLButtonElement;
    updateBtn.innerHTML = 'Update';
    // Log the internshipId to check if it's correctly passed
    console.log('Editing Internship ID:', internshipId);

    const internshipData = this.internships.find((internship: { internshipId: any; }) => internship.internshipId === internshipId);
    if (internshipData) {
      this.internshipData = { ...internshipData }; // Make a copy to avoid modifying the original data

      // Assuming you have a function to open a modal or form, handle the form submission
      // When the user updates and saves the changes in the modal/form, call updateInternship

      // Example function to handle form submission
      this.handleFormSubmission();
    }
  }

  handleFormSubmission() {
    if (this.internshipData) {
      // Call updateInternship from the service with the edited internship data
      this.internshipsService.updateInternship(this.internshipData).subscribe((updatedData) => {
        console.log('Internship updated successfully:', updatedData);
        // Optionally, update the displayed list of internships or perform any other action
        // Example: this.fetchInternships(); // Assuming you have a function to fetch internships
      }, (error) => {
        console.error('Error updating internship:', error);
        // Handle error, e.g., display error message
      });
    }
  }
}
