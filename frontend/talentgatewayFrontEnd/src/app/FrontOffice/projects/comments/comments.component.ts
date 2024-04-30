import { AuthenticationService } from './../../../core/services/auth.service';
import { CommentsService } from './../../../services/comments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import { co } from '@fullcalendar/core/internal-common';
import BadWordsFilter from 'bad-words';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments:any[]=[];
  projectId:any;
  currentuser:User;
  commentData = {
    commentContent: ''
  };
  badWordsFilter: any;
  constructor(private router:Router ,private  commentsService: CommentsService,private activatedroute: ActivatedRoute,private authService:AuthenticationService) { }
  async ngOnInit(): Promise<void> {

    let id= parseInt(this.activatedroute.snapshot.params['id']);
    this.badWordsFilter = new BadWordsFilter();
    this.projectId=id;
    this.currentuser = await this.authService.currentUser();
    console.log("current user:",this.currentuser);
    this.getCommentByProjectId();

  }

  getCommentByProjectId(){
    this.commentsService.getCommentById(this.projectId).subscribe(
      (comments: any[]) => {
        this.comments = comments;
        console.log("comments: ",this.comments);
        console.log("test project id:", this.projectId);
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }
  addNewComment(): void {
    const filteredCommentContent = this.filterBadWords(this.commentData.commentContent);

    const requestData = {
      ...this.commentData,
      commentContent: filteredCommentContent
    };

    this.commentsService.addComment(requestData, this.projectId, this.currentuser.id).subscribe((response: any) => {
      Swal.fire({
        title: "Good job!",
        text: "Your comment was added successfully!",
        icon: "success"
      });
      console.log("user id:",this.currentuser.id,"project id:",this.projectId,"comment content:",requestData.commentContent);
      this.getCommentByProjectId();
    });
  }



  filterBadWords(commentContent: string): string {
    return this.badWordsFilter.clean(commentContent);
  }
}


