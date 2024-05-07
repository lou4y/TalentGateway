import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Internship} from "../../../core/models/internship.model";
// @ts-ignore
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {CategorysService} from "../../../core/services/internships/categorys.service";
import {Category} from "../../../core/models/categorys.model";
import {
  FormBuilder,
  FormGroup,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {AuthenticationService} from "../../../core/services/auth.service";
import {User} from "../../../core/models/auth.models";


@Component({
  selector: 'app-add-internships',
  templateUrl: './add-internships.component.html',
  styleUrls: ['./add-internships.component.scss']
})
export class AddInternshipsComponent {
  internshipForm: FormGroup;
  categories: Category[] = [];
  user: User;


  form = new UntypedFormGroup({
    member: new UntypedFormArray([
      new UntypedFormControl(''),
    ]),
  });

  /**
   * Returns the form field value
   */
  get member(): UntypedFormArray { return this.form.get('member') as UntypedFormArray; }

  /**
   * Add the member field in form
   */
  addMember() {
    this.member.push(new UntypedFormControl());
  }

  /**
   * Onclick delete member from form
   */
  deleteMember(categoryId: number) {
    this.member.removeAt(categoryId);
  }

  constructor(
    private fb: FormBuilder,
    private internshipsService: InternshipsService,
    private categoryService: CategorysService,
    private toastr: ToastrService,
    private authService: AuthenticationService,

  ) {
    this.internshipForm = this.fb.group({
      intershipTitle: ['', Validators.required],
      intershipDescription: ['', Validators.required],
      intershipCompany: ['', Validators.required],
      intershipResponsibilities: ['', Validators.required],
      intershipQualifications: ['', Validators.required],
      intershipSkills: ['', Validators.required],
      intershipLocation: ['', Validators.required],
      intershipDuration: ['', Validators.required],
      intershipStartDate: ['', Validators.required],
      intershipType: ['', Validators.required],
      intershippostedDate: [new Date().toISOString().slice(0, 10), Validators.required],

      categoryId: [null, Validators.required]

    });
  }

  ngOnInit(): void {
    this.authService.currentUser().then((user) => {
      this.user = user;
      if (user) {
        if (user.role.includes('admin')) {
          this.loadCategories();
        } else if (user.role.includes('company')) {
          this.getCategoriesByUser(user.id.toString());
        }
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Error loading categories. Please try again.', 'Error');
      }
    );
  }


  getCategoriesByUser(userId: string): void {
    this.categoryService.getCategoriesByUser(userId).subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }



  createInternship(): void {
    if (this.internshipForm.valid && this.user) {

      const categoryNameValue = this.internshipForm.get('categoryId').value;

      const internshipData: Internship = {
        ...this.internshipForm.value,
        userId: this.user.id,
        categories: [
          {
            "categoryName": categoryNameValue,
          }

        ],
      };
      this.internshipsService.createInternship(internshipData).subscribe(
        response => {
          this.toastr.success('Internship created successfully!', 'Success');
          console.log('Internship created successfully:', response)
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

  onCategorySelect(categoryId: any) {
    console.log('Selected Category ID:', categoryId);
    // You can perform additional operations with the selected category ID here
  }
}



