import { Component, OnInit } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import BadWordsFilter from 'bad-words'; // Import the bad words filter
import { AdditionalUserData } from 'src/app/core/models/additional-user-data.model';
import { AdditionalUserDataService } from 'src/app/core/services/additional-user-data.service';
import { Base64 } from 'js-base64';

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
  userData: AdditionalUserData;

  constructor(
    private commentsService: CommentsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private userDataService: AdditionalUserDataService
  ) {}

  async ngOnInit(): Promise<void> {
    const encodedId = this.activatedRoute.snapshot.params['id'];

    // Décode l'identifiant avec Base64
    const decodedId = parseInt(Base64.decode(encodedId));
    this.projectId = decodedId;
    this.currentUser = await this.authService.currentUser();
    this.userData = await this.userDataService.getAdditionalUserData(this.currentUser.id).toPromise();

    this.getCommentByProjectId();
  }

  async getCommentByProjectId() {
    this.commentsService.getCommentById(this.projectId).subscribe(
      async (comments: any[]) => {
        // Loop through comments to get additional data for each user
        for (const comment of comments) {
          const userData = await this.userDataService
            .getAdditionalUserData(comment.userId) // Assuming userId is available in comment
            .toPromise();
          comment.userImage = userData.profilePicture; // Add user profile picture to the comment
        }

        this.comments = comments;
        this.filteredComments = this.paginateComments(this.comments, this.currentPage, this.pageSize);
      },
      (error) => {
        console.error('Error fetching comments:');
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
        this.commentData.commentContent = ''; // Clear the comment content
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
