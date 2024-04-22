import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allapplication', // Mise à jour du sélecteur
  templateUrl: './allapplication.component.html', // Mise à jour du template URL
  styleUrls: ['./allapplication.component.scss'], // Mise à jour du style URL
})
export class AllapplicationComponent implements OnInit { // Renommez ListComponent en AllapplicationComponent
  lists: any[] = [];
  totalRecords: number = 0;
  page: number = 1;
  searchTerm: string = ''; // Déclarez et initialisez searchTerm ici
  breadCrumbItems: any[] = [];
  startIndex: number = 0; // Ajouter la propriété startIndex
  endIndex: number = 0; // Ajouter la propriété endIndex

  constructor(private interviewService: InterviewService) { }

  ngOnInit(): void {
    this.getAllApplications();
  }

  // Méthode pour récupérer toutes les applications
  getAllApplications(): void {
    this.interviewService.getAllApplications().subscribe(
      (data: any[]) => {
        this.lists = data;
        this.totalRecords = this.lists.length;
        this.updatePagination(); // Mettre à jour la pagination
      },
      (error) => {
        console.error('Erreur lors de la récupération des applications :', error);
      }
    );
  }

  // Méthode pour filtrer les applications en fonction du statut
  filterApplicationsByStatus(status: string): void {
    this.interviewService.getAllApplicationsByStatus(status).subscribe(
      (data: any[]) => {
        this.lists = data;
        this.totalRecords = this.lists.length;
        this.updatePagination(); // Mettre à jour la pagination
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
      this.filterApplicationsByStatus(status); // Filtrer les applications par statut
    } else {
      // Gérer les autres cas (par exemple, si aucun des mots-clés n'est fourni)
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
}
