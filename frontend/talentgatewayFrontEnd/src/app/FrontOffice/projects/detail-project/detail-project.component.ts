import { Component } from '@angular/core';
import { overviewBarChart } from '../../../pages/projects/overview/data';

import { ChartType } from '../../../pages/projects/overview/overview.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AddTeamComponent } from '../add-team/add-team.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.scss']
})
export class DetailProjectComponent {
  project={projectId:'',projectName:'',projectDescription:'',startDate:'',endTime:'',price:0, creatorId:'', projectStatus:'',projectCreator:{
    userId:'',firstName:'',email:'',lastName:'',userRole:''},team:{
      teamId:0,name:'',usersWithRoles:[{user:{userId:'',firstName:'',lastName:''},memberRole:''}]
    }};
  breadCrumbItems: Array<{}>;
  projectId: any;
  overviewBarChart: ChartType;
  numberOfLikes: any;
  currentUser: User;

  constructor(private dialog: MatDialog, private activatedroute: ActivatedRoute,
     private projectservice: ProjectService,private router: Router,
     private authService: AuthenticationService,
    ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.currentUser();

    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Overview', active: true }];
    this.overviewBarChart = overviewBarChart;
    this.getNumberOfLikes();
    //get the project with id pass in the route
    const encodedId = this.activatedroute.snapshot.params['id'];
    const decodedId = parseInt(Base64.decode(encodedId));
    let id = decodedId;
    this.projectId=id;
    this.loadProjectData();

  }
  loadProjectData() {

    const encodedId = this.activatedroute.snapshot.params['id'];
    const decodedId = parseInt(Base64.decode(encodedId));
    let id = decodedId;
    this.projectId = id;
    this.projectservice.getProjectById(this.projectId).subscribe(
      (data) => {
        this.project = data;
        console.log("dataa",data.creatorId);

      },
      (error) => {
        console.log("error");
      }
    );
  }
  openAddTeamDialog() {
    this.dialog.open(AddTeamComponent, {
      width: '550px', // Taille du dialogue
      data: { projectId: this.projectId.crea }, // Passez l'ID du projet
    });
    this.loadProjectData();
  }

  getNumberOfLikes(){
    const encodedId = this.activatedroute.snapshot.params['id'];
    const decodedId = parseInt(Base64.decode(encodedId));
    let id = decodedId;
    this.projectservice.getNumberOfLikes(id).subscribe(
      data=>{
        this.numberOfLikes=data;
        console.log("number of likes:", this.projectId, this.numberOfLikes);
      },
      error=>{
        console.log("error");
      }
    )
  }


  deleteTeamMember(userId: string) {
    const teamId = this.project.team.teamId;

    this.projectservice.deleteTeamMember(teamId, userId).subscribe(
      (response) => {
        // Traitement des réponses qui ont réussi
        if (response.status >= 200 && response.status < 300) {
          this.project.team.usersWithRoles = this.project.team.usersWithRoles.filter(
            (user) => user.user.userId !== userId
          );
          Swal.fire({
            title: "Good job!",
            text: "Team member deleted successfully.",
            icon: "success"
          });
          this.loadProjectData();

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unexpected response'
          });
        }
      },
      (error) => {
        if (error.status === 200) {
          // Si le statut est 200 mais apparaît comme une erreur, traiter comme une réussite
          this.project.team.usersWithRoles = this.project.team.usersWithRoles.filter(
            (user) => user.user.userId !== userId
          );
          Swal.fire({
            title: "Good job!",
            text: "Team member deleted successfully.",
            icon: "success"
          });
          this.loadProjectData();
        } else {
          console.error("Error deleting team member:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete team member'
          });
        }
      }
    );
  }
}
