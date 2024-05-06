import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Internship} from "../../../core/models/internship.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {Category} from "../../../core/models/categorys.model";
import {CategorysService} from "../../../core/services/internships/categorys.service";

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  categoryId: number;
  categoryForm: FormGroup;
  categoryData: Category; // Add property to store internship data

  constructor(
    public dialogRef: MatDialogRef<UpdateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private categorysService: CategorysService,
  ) {
    this.categoryId = data.internshipId;
    this.categoryForm = this.formBuilder.group({
      title: ['', Validators.required],
      company: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInternshipDetails();
  }

  get f() {
    return this.categoryForm.controls;
  }

  getInternshipDetails() {
    this.categorysService.getCategoryById(this.categoryId).subscribe(
      (data: Category) => {
        this.categoryForm.patchValue({
          title: data.categoryName,
          company: data.categoryDescription
        });
        this.categoryData = data; // Store the internship data
      },
      (error) => {
        console.error('Error fetching internship details:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  updatecategory() {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        ...this.categoryData, // Copy existing data
        categoryName: this.categoryForm.value.title,
        categoryDescription: this.categoryForm.value.company
      };

      this.categorysService.updateCategory(updatedCategory).subscribe(
        (data: any) => {
          console.log('category updated successfully:', data);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating category:', error);
          // Handle error (e.g., show error message to user)
        }
      );
    } else {
      console.error('Form is invalid.');
      // Handle invalid form (e.g., show validation errors)
    }
  }

}
