import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectlistComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  projects: any[]; // Using any[] for simplicity
  page: any=1;

  constructor(private projectService: ProjectService,private router: Router) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  deleteInProgress: boolean = false;

  deleteProject(id: number) {
    // Check if delete operation is already in progress
    if (this.deleteInProgress) {
      return; // Exit if delete operation is already in progress
    }

    // Set deleteInProgress flag to true to indicate delete operation is in progress
    this.deleteInProgress = true;

    this.projectService.deleteProject(id).subscribe(
      () => {
        // After deletion, remove the deleted project from the list
        this.projects = this.projects.filter(project => project.id !== id);
        // Show alert indicating successful deletion
        alert('Project deleted successfully');
      },
      (error) => {
        //console.error('Error deleting project:', error);

        // Check if error object contains 'OK' status
        if (error === 'OK') {
          // If error is 'OK', it means deletion was successful
          // After deletion, remove the deleted project from the list
          this.projects = this.projects.filter(project => project.id !== id);
          // Show alert indicating successful deletion
          alert('Project deleted successfully');
        } else {
          // Show error message to user or handle error appropriately
          alert('Failed to delete project');
        }
      }
    ).add(() => {
      // Set deleteInProgress flag to false when delete operation is complete
      this.deleteInProgress = false;

      // Refresh the list by fetching the projects again
      this.loadProjects();
    });
  }
 // In projectlist.component.ts
 updateProject(projectId: any) {
  if (projectId) {
    this.router.navigate(['projects/updateProject', projectId]);
    console.log('Project ID:', projectId);
  } else {
    console.error('Project ID is undefined or not set properly');
  }
}




}
