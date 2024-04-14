import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listprojects',
  templateUrl: './listprojects.component.html',
  styleUrls: ['./listprojects.component.scss']
})
export class ListprojectsComponent implements OnInit {
  projects: any[] = [];
  userId = "abc";
  deleteInProgress: boolean = false;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects: any[]) => {
        this.projects = projects;
        // Combine loading projects and likes
        this.loadLikesForProjects();
        // Fetch number of likes for each project
        this.fetchNumberOfLikes();
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  fetchNumberOfLikes() {
    this.projects.forEach((project) => {
      this.projectService.getNumberOfLikes(project.projectId).subscribe(
        (numberOfLikes: number) => {
          project.numberOfLikes = numberOfLikes; // Assign the number of likes to the project
        },
        (error) => {
          console.error('Error fetching number of likes for project:', error);
        }
      );
    });
  }


  loadLikesForProjects() {
    this.projects.forEach((project) => {
      // Check if the user has liked each project
      this.projectService.isUserLikedProject(this.userId, project.projectId).subscribe(
        (isLiked: boolean) => {
          project.isLiked = isLiked; // Assign the isLiked property to the project
        },
        (error) => {
          console.error('Error fetching like status for project:', error);
        }
      );
    });
  }

  toggleLike(project: any) {
    // Check the current state of the like button
    console.log("Project oo:", project.isLiked);
    if (!project.isLiked) {
      // If the button is gray (not liked), like the project
      this.projectService.likeProject(project.projectId, this.userId).subscribe(
        () => {
          // Update the project's like status
          project.isLiked = true;
          console.log("Project liked successfully:", project.projectId);
          // Increment the number of likes
          project.numberOfLikes++;
          console.log("Number of likes updated:", project.numberOfLikes);
        },
        (error) => {
          console.log("Project:", project.projectId, this.userId);
          console.error('Error liking project:', error);
        }
      );
    } else {
      // If the button is red (liked), dislike the project
      this.projectService.dislikeProject(project.projectId, this.userId).subscribe(
        () => {
          // Update the project's like status
          project.isLiked = false;
          //console.log("Project disliked successfully:", project.projectId);
          // Decrement the number of likes
          project.numberOfLikes--;
          //console.log("Number of likes updated:", project.numberOfLikes);
        },
        (error) => {
          //console.error('Error disliking project:', error);
        }
      );
    }
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



}
