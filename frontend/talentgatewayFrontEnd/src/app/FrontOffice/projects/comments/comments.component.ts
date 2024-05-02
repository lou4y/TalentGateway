import { Component, OnInit } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import BadWordsFilter from 'bad-words'; // Import the bad words filter

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  comments: any[] = [];
  filteredComments: any[] = [];
  projectId: any;
  currentUser: User;
  commentData = { commentContent: '' };
  currentPage = 1;
  pageSize = 2;
  badWordsFilter = new BadWordsFilter(); // Initialize the bad words filter

  constructor(
    private commentsService: CommentsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id']);
    this.currentUser = await this.authService.currentUser();
    this.getCommentByProjectId();
  }

  getCommentByProjectId() {
    this.commentsService.getCommentById(this.projectId).subscribe(
      (comments: any[]) => {
        this.comments = comments;
        this.filteredComments = this.paginateComments(this.comments, this.currentPage, this.pageSize);
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  paginateComments(comments: any[], currentPage: number, pageSize: number): any[] {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return comments.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    const totalPages = Math.ceil(this.comments.length / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.filteredComments = this.paginateComments(this.comments, this.currentPage, this.pageSize);
    }
  }

  addNewComment() {
    const filteredCommentContent = this.filterBadWords(this.commentData.commentContent);

    this.commentsService.addComment(
      { commentContent: filteredCommentContent },
      this.projectId,
      this.currentUser.id
    ).subscribe(
      () => {
        Swal.fire({
          title: 'Good job!',
          text: 'Your comment was added successfully!',
          icon: 'success',
        });
        this.getCommentByProjectId(); // Reload comments
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add your comment.',
        });
      }
    );
  }

  filterBadWords(commentContent: string): string {
    return this.badWordsFilter.clean(commentContent); // Use the initialized filter
  }
}
