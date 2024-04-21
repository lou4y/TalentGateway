import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectlistComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  projects: any[]; // Using any[] for simplicity
  page: any = 1;
  deleteInProgress: boolean = false;
  searchCriteria: string = '';

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.loadProjects();
  }
  getDescription(description: string): string {
    if (description.length > 50) {
      return this.insertLineBreaks(description, 50);
    } else {
      return description;
    }
  }

  insertLineBreaks(str: string, maxLength: number): string {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return str.match(regex)?.join('<br/>') || str;
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
        Swal.fire({
          title: "Good job!",
          text: "Your Project deleted successfully!",
          icon: "success"
        });
      },
      (error) => {
        //console.error('Error deleting project:', error);

        // Check if error object contains 'OK' status
        if (error === 'OK') {
          // If error is 'OK', it means deletion was successful
          // After deletion, remove the deleted project from the list
          this.projects = this.projects.filter(project => project.id !== id);
          // Show alert indicating successful deletion
          Swal.fire({
            title: "Good job!",
            text: "Your Project deleted successfully!",
            icon: "success"
          });
        } else {
          // Show error message to user or handle error appropriately
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to delete your project",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
      }
    ).add(() => {
      // Set deleteInProgress flag to false when delete operation is complete
      this.deleteInProgress = false;

      // Refresh the list by fetching the projects again
      this.loadProjects();
    });
  }

  updateProject(projectId: any) {
    if (projectId) {
      this.router.navigate(['projects/updateProject', projectId]);
      console.log('Project ID:', projectId);
    } else {
      console.error('Project ID is undefined or not set properly');
    }
  }

  onSearch(value: string) {
    // Update the search criteria
    this.searchCriteria = value;
    // Perform search
    this.searchProjects();
  }

  searchProjects() {
    this.projectService.searchProjects(this.searchCriteria).subscribe(
      (result: any[]) => {
        this.projects = result;
      },
      (error) => {
        console.error('Error searching projects:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }
}
