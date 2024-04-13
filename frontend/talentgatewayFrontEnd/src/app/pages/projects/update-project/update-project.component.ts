import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  projectId: any;
  project: any;
  originalProject: any; // Store the original project details

  teams: any[] = [];
  selectedTeam: number;
  file: File | null = null;
  fileURL: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private teamService: TeamService
  ) {
    this.project = { projectId: '', projectName: '', projectDescription: '', startDate: '', endTime: '', price: 0, projectFile: ''};
    this.originalProject = { ...this.project }; // Create a copy of the default project object
  }

  ngOnInit(): void {
    // Get the project ID from the route parameters
    this.projectId = this.activatedRoute.snapshot.params['id'];
    // Fetch the project details based on the ID
    this.getProjectDetails();
    this.fetchTeams();
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

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe(
      (data: any) => {
        this.project = { ...data }; // Bind project details to the project object
        this.originalProject = { ...data }; // Update the original project with fetched data
      },
      (error) => {
        console.error('Error fetching project details:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  updateProject() {
    // Check if any field has been modified
    const isModified =
      this.project.projectName !== this.originalProject.projectName ||
      this.project.projectDescription !== this.originalProject.projectDescription ||
      this.project.startDate !== this.originalProject.startDate ||
      this.project.endTime !== this.originalProject.endTime ||
      this.project.price !== this.originalProject.price ||
      (this.file && this.file.name !== this.originalProject.projectFile); // Check if file name has changed

    // If no fields have been modified, alert the user and return
    if (!isModified) {
      alert('No changes detected.');
      return;
    }

    // Make sure all required fields are provided
    if (!this.project.projectName || !this.project.projectDescription || !this.project.startDate || !this.project.endTime || !this.project.price) {
      alert('Please provide all required project details');
      return;
    }

    // Make sure startDate is before endDate
    if (new Date(this.project.startDate) >= new Date(this.project.endTime)) {
      alert('End Date must be after Start Date');
      return;
    }

    // Make sure price is a positive number
    if (this.project.price <= 0) {
      alert('Price must be a positive number');
      return;
    }

    // If a new file is selected, update the projectFile property
    if (this.file) {
      this.project.projectFile = this.file.name;
    }

    // Send the updated project data to the server
    this.projectService.updateProject(this.project).subscribe(
      (response) => {
        alert('Project updated successfully');
        // Redirect to projects list or any other page as needed
        this.router.navigate(['/projects/list']);
      },
      (error) => {
        console.error('Error updating project:', error);
        // Show error message to user or handle error appropriately
        alert('Failed to update project');
      }
    );
  }



}
