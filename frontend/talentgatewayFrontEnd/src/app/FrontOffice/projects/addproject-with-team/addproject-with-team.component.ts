import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';
import { ProjectService } from 'src/app/services/project.service';
import { TestuserService } from 'src/app/services/testuser.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addproject-with-team',
  templateUrl: './addproject-with-team.component.html',
  styleUrls: ['./addproject-with-team.component.scss']
})
export class AddprojectWithTeamComponent implements OnInit, AfterViewInit {
  @ViewChild('cdkStepper', { static: true }) cdkStepper: CdkStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  searchControl = new FormControl('');
  currentUser: User;
  users: any[] = [];
  filteredUsers: any[] = [];
  url: any;
  // Updated structure to include first and last name
  selectedTeamMembers: { userId: string; firstName: string; lastName: string; memberRole: string }[] = [];
  selectedFileName: string | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<AddprojectWithTeamComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private testuserService: TestuserService,
    private authService: AuthenticationService,
    private fireStorage: AngularFireStorage
  ) {}
  ngAfterViewInit() {
    if (!this.fileInputRef) {
      console.error("fileInputRef is not initialized");
    }
  }

  async ngOnInit(): Promise<void> {
    //récupérer ll'utilisateur connecté
    this.currentUser = await this.authService.currentUser();
    // Initialize form groups with required fields
    this.firstFormGroup = this.formBuilder.group({
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      startDate: ['', Validators.required],
      endTime: ['', Validators.required],
      price: ['', Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
      teamName: ['', Validators.required], // Required field for team name
    });

    // Load users for autocomplete
    this.loadUsers();
  }

  loadUsers(): void {
    this.testuserService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  onUserSelected(event: any): void {
    const selectedUserId = event.option.value;
    const selectedUser = this.users.find(user => user.userId === selectedUserId);

    if (selectedUser && !this.selectedTeamMembers.some(member => member.userId === selectedUserId)) {
      // Add user to the selected team with additional details
      this.selectedTeamMembers.push({
        userId: selectedUserId,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        memberRole: '', // Default role to be updated later
      });

      this.searchControl.setValue(''); // Clear the search control
    }
  }

  updateTeamMemberRole(userId: string, role: string): void {
    const teamMember = this.selectedTeamMembers.find(member => member.userId === userId);
    if (teamMember) {
      teamMember.memberRole = role; // Update the member's role
    }
  }

  submitProject(): void {
    if (this.fileInputRef && this.fileInputRef.nativeElement.files.length > 0) {
      this.uploadFile(this.fileInputRef.nativeElement.files[0]);
    }

    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      const projectData = {
        projectName: this.firstFormGroup.controls['projectName'].value,
        projectDescription: this.firstFormGroup.controls['projectDescription'].value,
        startDate: this.secondFormGroup.controls['startDate'].value,
        endTime: this.secondFormGroup.controls['endTime'].value,
        price: this.secondFormGroup.controls['price'].value,
        projectStatus: "PLANNING", // Default status
        creatorId: this.currentUser.id,
        projectFile: this.url,
        team: {
          name: this.thirdFormGroup.controls['teamName'].value,
          usersWithRoles: this.selectedTeamMembers.map(member => ({
            userId: member.userId,
            memberRole: member.memberRole,
          })),
        },
      };

      this.projectService.addProject(projectData).subscribe(
        (response) => {
          Swal.fire({
            title: "Good job!",
            text: "Your Project added successfully!",
            icon: "success"
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There is a problem to add the project!"
          });
          // Handle error
        }
      );
    } else {
      console.warn("Form is invalid");
    }
  }
  //close dialog
  onCancel() {
    this.dialogRef.close(); // Fermer le dialogue sans soumission
  }
  triggerFileInput(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click(); // Triggers the hidden file input
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadFile(file); // Handles the file upload
    }
  }



  onFileDrop(droppedFiles: NgxFileDropEntry[]): void {
    const fileEntry = droppedFiles[0]?.fileEntry as FileSystemFileEntry;
    if (fileEntry) {
      fileEntry.file((file: File) => {
        this.uploadFile(file);
      });
    }
  }

  async uploadFile(file: File): Promise<void> {
    const path = `projectfiles/${file.name}`;
    const uploadTask = await this.fireStorage.upload(path, file);
    const fileUrl = await uploadTask.ref.getDownloadURL();
    console.log("File uploaded:", fileUrl);

    // Assign the file URL to a property for later use
    this.url = fileUrl;
    this.selectedFileName = file.name;
  }
}
