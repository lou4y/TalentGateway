import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  file: File | null = null;
  fileURL: string | ArrayBuffer | null = null;
  teams: any[] = [];
  selectedTeam: number;
  currentuser:User;
  projectData = {
    projectName: '',
    projectDescription: '',
    projectStatus: '',
    startDate: '',
    endTime: '',
    price: 0
  };

  constructor(
    private projectService: ProjectService,
    private http: HttpClient,
    private teamService: TeamService,
    private authService: AuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.fetchTeams();
    this.currentuser = await this.authService.currentUser();
  }

  fetchTeams() {
    this.teamService.getTeams().subscribe((teams: any[]) => {
      this.teams = teams;
    });
  }

  onFileSelected(event: any) {
    if (event && event.addedFiles && event.addedFiles.length > 0) {
      this.file = event.addedFiles[0];
      this.getFileDataURL(this.file);
    } else {
      console.error('No file selected.');
    }
  }

  getFileDataURL(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileURL = reader.result;
    };
    reader.readAsDataURL(file);
  }

  addNewProject() {
    if (!this.file) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a file for the project.!"
        });
        return;
    }

    if (!this.selectedTeam) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a team for the project.!"
        });
        return;
    }

    const projectData = {
        projectName: this.projectData.projectName,
        projectDescription: this.projectData.projectDescription,
        startDate: this.projectData.startDate,
        endTime: this.projectData.endTime,
        price: this.projectData.price,
        projectFile: this.file.name,
        projectStatus: this.projectData.projectStatus,
        creatorId: this.currentuser.id,
        team: {
            teamId: this.selectedTeam // Ensure that the teamId is correctly named
        }
    };

    this.projectService.addProject(projectData).subscribe((response: any) => {
      Swal.fire({
        title: "Good job!",
        text: "Your Project added successfully!",
        icon: "success"
      });

        // Reset the form or perform other necessary actions
    });
}

  onRemove() {
    this.file = null;
    this.fileURL = null;
  }
}
