import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Internship } from "../../../core/models/internship.model";
import { InternshipsService } from "../../../core/services/internships/internships.service";

@Component({
  selector: 'app-update-internship',
  templateUrl: './update-internship.component.html',
  styleUrls: ['./update-internship.component.scss']
})
export class UpdateInternshipComponent implements OnInit {
  internshipId: number;
  internshipForm: FormGroup;
  internshipData: Internship; // Add property to store internship data

  constructor(
    public dialogRef: MatDialogRef<UpdateInternshipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private internshipService: InternshipsService,
  ) {
    this.internshipId = data.internshipId;
    this.internshipForm = this.formBuilder.group({
      title: ['', Validators.required],
      company: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInternshipDetails();
  }

  get f() {
    return this.internshipForm.controls;
  }

  getInternshipDetails() {
    this.internshipService.getInternshipById(this.internshipId).subscribe(
      (data: Internship) => {
        this.internshipForm.patchValue({
          title: data.intershipTitle,
          company: data.intershipCompany
        });
        this.internshipData = data; // Store the internship data
      },
      (error) => {
        console.error('Error fetching internship details:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  updateInternship() {
    if (this.internshipForm.valid) {
      const updatedInternship: Internship = {
        ...this.internshipData, // Copy existing data
        intershipTitle: this.internshipForm.value.title,
        intershipCompany: this.internshipForm.value.company
      };

      this.internshipService.updateInternship(updatedInternship).subscribe(
        (data: any) => {
          console.log('Internship updated successfully:', data);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating internship:', error);
          // Handle error (e.g., show error message to user)
        }
      );
    } else {
      console.error('Form is invalid.');
      // Handle invalid form (e.g., show validation errors)
    }
  }

}
