import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import Pusher from 'pusher-js';
import { ToastrService } from 'ngx-toastr';
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
  private pusher: any;
  private channel: any;

  constructor(
    private projectService: ProjectService,
    private http: HttpClient,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.fetchTeams();
    this.currentuser = await this.authService.currentUser();
    //this.initializePusher();
  }

  fetchTeams() {
    this.teamService.getTeams().subscribe((teams: any[]) => {
      this.teams = teams;
    });
  }
  /*initializePusher(): void {
    this.pusher = new Pusher('3867787e7fdcc8389321', {
      cluster: 'ap4',
      forceTLS: true
    });

    this.channel = this.pusher.subscribe('projects');
    this.channel.bind('new-project', (data: any) => {
      const message = `${data.message}`;
      this.toastr.success(message, 'Project Notification', {
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    });
  }*/

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
      this.toastr.success("Project created successfully!", "Success");

        // Reset the form or perform other necessary actions
    });
}

  onRemove() {
    this.file = null;
    this.fileURL = null;
  }
}
