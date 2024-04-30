import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service'; // Importez le service AuthenticationService ici
 
@Component({
  selector: 'app-allapplication',
  templateUrl: './allapplication.component.html',
  styleUrls: ['./allapplication.component.scss']
})
export class AllapplicationComponent implements OnInit {
  lists: any[] = [];
  totalRecords: number = 0;
  page: number = 1;
  searchTerm: string = '';
  breadCrumbItems: any[] = [];
  startIndex: number = 0;
  endIndex: number = 0;

  pendingCount: number = 0;
  rejectedCount: number = 0;
  acceptedCount: number = 0;

  user: any; // Ajoutez une propriété user pour stocker l'utilisateur connecté
  totalApplications: number = 0; 
  interviewDates: Date[] = [];
  constructor(
    private interviewService: InterviewService,
    private authService: AuthenticationService // Injectez le service AuthenticationService ici
  ) { }

  ngOnInit(): void {
    this.authService.currentUser().then(user => {
      this.user = user;
      this.getAllApplications();
    });
  }

   
  // Méthode pour récupérer toutes les applications de l'utilisateur connecté
  getAllApplications(): void {
    this.interviewService.getUserApplications(this.user.id).subscribe(
      (data: any[]) => {
        this.lists = data.map(application => ({
          ...application,
          title: application.intershipTitle,
          start: application.interview?.dateEntretien,
          classNames: ['interview-event']
        }));
        this.interviewDates = data.map(application => application.interview?.dateEntretien || null).filter(date => date !== null);
        this.totalRecords = this.lists.length;

        // Appel à la fonction pour calculer les pourcentages
        this.calculateStatusPercentage();

        // Autres actions nécessaires après la récupération des applications
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching user applications:', error);
      }
    );
  }
  

  
  
   
  
  // Méthode pour filtrer les applications en fonction du statut
  filterApplicationsByStatus(status: string): void {
    this.interviewService.getAllApplicationsByStatus(status).subscribe(
      (data: any[]) => {
        this.lists = data;
        this.totalRecords = this.lists.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors de la récupération des applications filtrées par statut :', error);
      }
    );
  }

  // Méthode pour rechercher en fonction du terme de recherche
  searchApplications(): void {
    const status = this.searchTerm.toUpperCase();
    if (status === 'ACCEPTED' || status === 'PENDING' || status === 'REJECTED') {
      this.filterApplicationsByStatus(status);
    } else {
      // Gérer les autres cas
    }
  }

  // Fonction pour obtenir les applications pour la page actuelle
  getCurrentPageApplications(): any[] {
    const startIndex = (this.page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, this.totalRecords);
    return this.lists.slice(startIndex, endIndex);
  }

  // Fonction pour changer de page
  pageChanged(event: any): void {
    this.page = event;
  }

  // Fonction pour mettre à jour les index de pagination
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








  calculateStatusPercentage(): void {
    const total = this.totalRecords;
  
    if (total > 0) {
      this.acceptedCount = (this.lists.filter(app => app.status === 'ACCEPTED').length / total) * 100;
      this.pendingCount = (this.lists.filter(app => app.status === 'PENDING').length / total) * 100;
      this.rejectedCount = (this.lists.filter(app => app.status === 'REJECTED').length / total) * 100;
    } else {
      // Gérer le cas où total est égal à zéro (éviter les divisions par zéro)
      this.acceptedCount = 0;
      this.pendingCount = 0;
      this.rejectedCount = 0;
    }
  }
  





}
