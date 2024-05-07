import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../../core/services/auth.service";
import {InternshipsService} from "../../../core/services/internships/internships.service";
import {CategorysService} from "../../../core/services/internships/categorys.service";
import {User} from "../../../core/models/auth.models";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Category} from "../../../core/models/categorys.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {Internship} from "../../../core/models/internship.model";
import {UpdateInternshipComponent} from "../update-internship/update-internship.component";
import {UpdateCategoryComponent} from "../update-category/update-category.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

/**
 * Categories Component
 */
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  breadCrumbItems: Array<{}>;
  user: User;
  categoryForm: FormGroup;
  modalRef: BsModalRef;

  isEditMode = false;
  selectedcategories: Category | null = null;
  categoriesData: Category | null = null; // For storing the currently edited internship


  @ViewChild('content') content: TemplateRef<any>;

  constructor(private authService: AuthenticationService,
              private categorysService: CategorysService,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private dialog: MatDialog

  ) {
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      categoryDescription: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.breadCrumbItems = [{label: 'Jobs'}, {label: 'Internships Categories', active: true}];


    this.user = await this.authService.currentUser();
    if (this.user) {
      if (this.user.role.includes('admin')) {
        this.getAllCategories();
      } else if (this.user.role.includes('company')) {
        this.getCategoriesByUser(this.user.id.toString());
      }
    }


  }




  getAllCategories(): void {
    this.categorysService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getCategoriesByUser(userId: string): void {
    this.categorysService.getCategoriesByUser(userId).subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  removeCategory(categoryId: any): void {
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
        if (result.isConfirmed) {
          this.categorysService.deleteCategory(categoryId).subscribe(
            () => {
              console.log('Category deleted successfully');
              this.getCategoriesByUser(this.user.id.toString()); // Refresh categories by user after deletion
            },
            (error) => {
              console.error('Error deleting category:', error);
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your category is safe :)',
            'error'
          );
        }
      });
    this.ngOnInit();
  }


  openModal(): void {
    this.modalRef = this.modalService.show(this.content);
  }

  createCategory(): void {
    if (this.categoryForm.valid && this.user) {
      const categoryData: Category = {
        ...this.categoryForm.value,
        userId: this.user.id
      };

      this.categorysService.createCategory(categoryData).subscribe(
        response => {
          this.toastr.success('Category created successfully!', 'Success');
          this.categoryForm.reset();
        },
        error => {
          console.error('Error creating category:', error);
          this.toastr.error('Error creating category. Please try again.', 'Error');
        }
      );
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }


  edit(category: Category): void {
    this.selectedcategories = { ...category };
    this.isEditMode = true;
  }
//edit
  openUpdatecategoryDialog(categoryId: number): void {
    this.dialog.open(UpdateCategoryComponent, {
      width: '550px',
      data: { categoryId } // Pass the internshipId to the dialog component
    });
  }
  editDataGet(categoryId: any, content: any) {
    console.log('Editing category ID:', categoryId);
    this.modalRef = this.modalService.show(content, {class: 'modal-md'});
    const modelTitle = document.querySelector('.modal-title') as HTMLHeadingElement;
    modelTitle.innerHTML = 'Edit Internship';
    const updateBtn = document.getElementById('add-btn') as HTMLButtonElement;
    updateBtn.innerHTML = 'Update';
    // Log the internshipId to check if it's correctly passed
    console.log('Editing Internship ID:', categoryId);

    const categoriesData = this.categories.find((category: { categoryId: any; }) => category.categoryId === categoryId);
    if (categoriesData) {
      this.categoriesData = { ...categoriesData }; // Make a copy to avoid modifying the original data

      // Assuming you have a function to open a modal or form, handle the form submission
      // When the user updates and saves the changes in the modal/form, call updateInternship

      // Example function to handle form submission
      this.handleFormSubmission();
    }
  }

  handleFormSubmission() {
    if (this.categoriesData) {
      // Call updateInternship from the service with the edited internship data
      this.categorysService.updateCategory(this.categoriesData).subscribe((updatedData) => {
        console.log('category updated successfully:', updatedData);
        // Optionally, update the displayed list of internships or perform any other action
        // Example: this.fetchInternships(); // Assuming you have a function to fetch internships
      }, (error) => {
        console.error('Error updating category:', error);
        // Handle error, e.g., display error message
      });
    }
  }


}
