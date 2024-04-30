import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { CommentsService } from 'src/app/services/comments.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-listprojects',
  templateUrl: './listprojects.component.html',
  styleUrls: ['./listprojects.component.scss']
})
export class ListprojectsComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  currentUser: User;
  userId: String;
  deleteInProgress = false;
  currentPage = 1; // Current page number
  pageSize = 4; //

  constructor(
    private projectService: ProjectService,
    private commentsService: CommentsService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.authService.currentUser();
    this.userId = this.currentUser.id;
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects: any[]) => {
        this.projects = projects;
        this.filteredProjects = this.paginateProjects(this.projects, this.currentPage, this.pageSize);
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  paginateProjects(projects: any[], currentPage: number, pageSize: number): any[] {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return projects.slice(startIndex, endIndex); // Return only projects for the current page
  }

  goToPage(page: number) {
    const totalPages = Math.ceil(this.projects.length / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.filteredProjects = this.paginateProjects(this.projects, this.currentPage, this.pageSize);
    }
  }

  async onFilterChange(filterEvent: any) {
    // Apply the desired filtering logic
    switch (filterEvent.type) {
      case 'general':
        if (filterEvent.value === 'mostLikes') {
          this.filteredProjects = [...this.projects].sort((a, b) => b.numberOfLikes - a.numberOfLikes);
        } else if (filterEvent.value === 'topPositiveComments') {
          this.commentsService.getTopProjectsWithPositiveComments().subscribe(
            async (projects: any[]) => {
              this.filteredProjects = projects;
              this.fetchNumberOfLikes();
              this.loadLikesForProjects();
              this.currentUser = await this.authService.currentUser();
            },
            (error) => {
              console.error('Error fetching top projects with positive comments:', error);
            }
          );
        } else {
          this.filteredProjects = [...this.projects]; // Reset to all project
        }
        break;

        case 'price':
          const { min, max } = filterEvent.value; // Range from the slider
          this.filteredProjects = this.projects.filter(
            (project) => project.price >= min && project.price <= max
          );
          break;

      case 'checkbox':
        if (filterEvent.value === 'isLiked') {
          this.filteredProjects = this.projects.filter(project => project.isLiked);
        } else if (filterEvent.value === 'isMine') {
          this.filteredProjects = this.projects.filter(
            (project) => project.projectCreator?.userId === this.currentUser.id
          );
        }
        break;

      default:
        this.filteredProjects = [...this.projects]; // Reset to all projects
        break;
    }

    // Re-fetch the number of likes and update the like status after filtering
    this.fetchNumberOfLikes();
    this.loadLikesForProjects();
    this.currentUser;
  }

  fetchNumberOfLikes() {
    this.filteredProjects.forEach((project) => {
      this.projectService.getNumberOfLikes(project.projectId).subscribe(
        (numberOfLikes: number) => {
          project.numberOfLikes = numberOfLikes; // Assign the number of likes to the filtered project
        },
        (error) => {
          console.error('Error fetching number of likes for project:', error);
        }
      );
    });
  }

  loadLikesForProjects() {
    this.filteredProjects.forEach((project) => {
      this.projectService.isUserLikedProject(this.currentUser.id, project.projectId).subscribe(
        (isLiked: boolean) => {
          project.isLiked = isLiked; // Assign the isLiked property to the filtered project
        },
        (error) => {
          console.error('Error fetching like status for project:', error);
        }
      );
    });
  }

  toggleLike(project: any) {
    if (!project.isLiked) {
      this.projectService.likeProject(project.projectId, this.currentUser.id).subscribe(
        () => {
          project.isLiked = true;
          project.numberOfLikes++;
        },
        (error) => {
          console.error('Error liking project:', error);
        }
      );
    } else {
      this.projectService.dislikeProject(project.projectId, this.currentUser.id).subscribe(
        () => {
          project.isLiked = false;
          project.numberOfLikes--;
        },
        (error) => {
          console.error('Error disliking project:', error);
        }
      );
    }
  }

  showDetailProject(project: any) {
    this.router.navigate(['/detailProject', project.projectId]);
  }

  deleteProject(id: number) {
    if (this.deleteInProgress) {
      return; // Exit if delete operation is in progress
    }

    this.deleteInProgress = true;

    this.projectService.deleteProject(id).subscribe(
      () => {
        this.projects = this.projects.filter((project) => project.projectId !== id);
        Swal.fire({
          title: 'Good job!',
          text: 'Your project was deleted successfully!',
          icon: 'success'
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete your project',
          footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
    ).add(() => {
      this.deleteInProgress = false;
      this.loadProjects(); // Refresh the list after deletion
    });
  }
}
