import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService } from 'src/app/services/team.service';
import { TestuserService } from 'src/app/services/testuser.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
})
export class AddTeamComponent implements OnInit {
  // Champs existants
  colorControl = new FormControl('primary');
  searchControl = new FormControl('');
  users: any[] = []; // Tous les utilisateurs
  filteredUsers: any[] = []; // Utilisateurs filtrés
  selectedUserId: string = ''; // ID de l'utilisateur sélectionné
  roleControl = new FormControl(''); // Contrôle du rôle
  errorMessage: string = ''; // Message d'erreur
  projectId: number; // ID du projet
  selectedUserName: string = ''; // Nom complet de l'utilisateur sélectionné
  selectedUserPhone: string = ''; // Numéro de téléphone de l'utilisateur sélectionné
  snackBar:MatSnackBar;
  constructor(
    public dialogRef: MatDialogRef<AddTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private testuserService: TestuserService,
    private teamService: TeamService
  ) {
    this.projectId = data.projectId;
  }

  ngOnInit(): void {
    this.getAllUsers(); // Récupération de tous les utilisateurs
    this.searchControl.valueChanges.subscribe((value) => {
      this.filterUsers(value); // Filtrage des utilisateurs
    });
  }

  getAllUsers() {
    this.testuserService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users; // Stockage des utilisateurs
        this.filterUsers(''); // Filtre initial
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  filterUsers(query: string) {
    this.filteredUsers = this.users
      .filter((user) => {
        const firstName = user.firstName?.toLowerCase() || '';
        const lastName = user.lastName?.toLowerCase() || '';
        return firstName.includes(query.toLowerCase()) || lastName.includes(query.toLowerCase());
      })
      .slice(0, 3); // Afficher un nombre limité de résultats
  }

  onUserSelected(event: any): void {
    if (event && event.option && event.option.value) {
      const selectedUser = this.users.find(user => user.id === event.option.value);
      if (selectedUser) {
        this.searchControl.setValue(selectedUser.firstName + ' ' + selectedUser.lastName); // Afficher le nom complet
        this.selectedUserId = selectedUser.id; // Stocker l'ID pour la soumission
        this.selectedUserName = `${selectedUser.firstName} ${selectedUser.lastName}`; // Nom complet
        this.selectedUserPhone = selectedUser.phoneNumber; // Numéro de téléphone
      }
    } else {
      console.error("Sélection invalide: événement ou valeur est nul(le) ou indéfini(e)");
    }
  }

  onSubmit(): void {
    console.log("Attempting to add a new team member with User ID:", this.selectedUserId);

    const userId = this.selectedUserId;
    const memberRole = this.roleControl.value;
    const phoneNumber = "+21658810345";
    const userName = this.selectedUserName; // Pour le message personnalisé

    const message = `Welcome to the team, dear ${userName}!`; // Message de bienvenue

    if (!userId || !memberRole) {
        this.errorMessage = "User ID or Member Role is missing"; // Message d'erreur
        this.snackBar.open(this.errorMessage, 'Close', {
            duration: 3000,
        });
        return; // Ne pas continuer si la validation échoue
    }

    this.teamService.addTeamMemberToProject(this.projectId, userId, memberRole).subscribe(
        (response) => {


            this.teamService.sendSms(phoneNumber, message).subscribe(
                () =>Swal.fire({
            title: "Good job!",
            text: "Team member added successfully.",
            icon: "success"
          }),
                (error) =>   Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "error to send sms"
                })
            );

            this.dialogRef.close(); // Fermer le dialogue après succès
        },
        (error) => {
            let errorMessage = 'An error occurred while adding the team member.';
            if (error.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "The user is already a member of the team."
              });

            }
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "The user is already a member of the team."
            });

        }
    );

    this.getAllUsers(); // Rafraîchir la liste des utilisateurs
}





  onCancel() {
    this.dialogRef.close(); // Fermer le dialogue sans soumission
  }
}
