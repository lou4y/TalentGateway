import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Internship} from "../../../core/models/internship.model";
// @ts-ignore
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {CategorysService} from "../../../core/services/internships/categorys.service";
import {Category} from "../../../core/models/categorys.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-add-internships',
  templateUrl: './add-internships.component.html',
  styleUrls: ['./add-internships.component.scss']
})
export class AddInternshipsComponent {
  internshipForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private internshipsService: InternshipsService,
    private categoryService: CategorysService,
    private toastr: ToastrService
  ) {
    this.internshipForm = this.fb.group({
      intershipTitle: ['', Validators.required],
      internshipDescription: ['', Validators.required],

      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      error => {
        console.error('Error loading categories:', error);
        this.toastr.error('Error loading categories. Please try again.', 'Error');
      }
    );
  }

  createInternship(): void {
    if (this.internshipForm.valid) {
      const internshipData: Internship = this.internshipForm.value as Internship;
      this.internshipsService.createInternship(internshipData).subscribe(
        response => {
          console.log('Internship created successfully:', response);
          this.toastr.success('Internship created successfully!', 'Success');
          this.internshipForm.reset();
        },
        error => {
          console.error('Error creating internship:', error);
          this.toastr.error('Error creating internship. Please try again.', 'Error');
        }
      );
    } else {
      this.internshipForm.markAllAsTouched();
    }
  }
}
