import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Import des modules nécessaires
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
  jobListForm: FormGroup; // Déclaration du formulaire FormGroup
  applicationId: any;

  // Injectez les services requis dans le constructeur
  constructor(
    private interviewService: InterviewService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder // Injection du FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllApplications();
    this.initForm(); // Initialisation du formulaire
  }

  initForm(): void {
    this.jobListForm = this.formBuilder.group({
      interviewDate: ['', Validators.required], // Définition des contrôles de formulaire avec validation requise
      interviewTime: ['', Validators.required],
      interviewMode: ['', Validators.required],
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

 // Méthode pour supprimer une application
 deleteApplication(id: string): void {
  this.interviewService.deleteApplication(id).subscribe(
    (response) => {
      // Si la suppression réussit, mettre à jour la liste des applications
      this.getAllApplications();
    },
    (error) => {
      console.error('Erreur lors de la suppression de l\'application :', error);
    }
  );
}

   // Méthode pour confirmer la suppression de l'application
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
          // Appeler la méthode de suppression ici avec l'ID de l'application à supprimer
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
    this.applicationId = id; // Sauvegardez l'ID de l'application
    // Vous pouvez maintenant utiliser this.applicationId pour l'ID de l'application
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Create Interview';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    var listData = this.lists.filter((data: { id: any; }) => data.id === id);
    // Utilisez listData pour pré-remplir le formulaire d'édition
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
      dateEntretien: combinedDateTime, // Utilisez le nom de propriété correct pour la date
      modaliteEntretien: this.jobListForm.value.interviewMode // Utilisez le nom de propriété correct pour la modalité
    };
  
    this.interviewService.createInterview(applicationId, interviewData).subscribe(
      (response) => {
        console.log('Interview created successfully:', response);
        // Réinitialiser le formulaire après la création de l'interview
        this.jobListForm.reset();
        // Masquer le modal
        this.modalRef.hide();
      },
      (error) => {
        console.error('Error creating interview:', error);
      }
    );
  }
  



}
