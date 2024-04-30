import { Component } from '@angular/core';
import { overviewBarChart } from '../../../pages/projects/overview/data';

import { ChartType } from '../../../pages/projects/overview/overview.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AddTeamComponent } from '../add-team/add-team.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.scss']
})
export class DetailProjectComponent {
  project={projectId:'',projectName:'',projectDescription:'',startDate:'',endTime:'',price:0, projectStatus:'',projectCreator:{
    userId:'',firstName:'',email:'',lastName:'',userRole:''},team:{
      teamId:0,name:'',usersWithRoles:[{user:{userId:'',firstName:'',lastName:''},memberRole:''}]
    }};
  breadCrumbItems: Array<{}>;
  projectId: any;
  overviewBarChart: ChartType;
  numberOfLikes: any;

  constructor(private dialog: MatDialog, private activatedroute: ActivatedRoute, private projectservice: ProjectService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Overview', active: true }];


    this.overviewBarChart = overviewBarChart;
    this.getNumberOfLikes();
    //get the project with id pass in the route
    let id= parseInt(this.activatedroute.snapshot.params['id']);
    this.projectId=id;
    this.projectservice.getProjectById(id).subscribe(
      data=>{
        this.project=data;
        console.log("test:", this.project);
      },
      error =>{
        console.log(error);
      }
    )

  }
  openAddTeamDialog() {
    this.dialog.open(AddTeamComponent, {
      width: '550px', // Taille du dialogue
      data: { projectId: this.projectId }, // Passez l'ID du projet
    });
  }
  
  getNumberOfLikes(){
    let id= parseInt(this.activatedroute.snapshot.params['id']);
    this.projectservice.getNumberOfLikes(id).subscribe(
      data=>{
        this.numberOfLikes=data;
        console.log("number of likes:", this.projectId, this.numberOfLikes);
      },
      error=>{
        console.log(error);
      }
    )
  }
  

  deleteTeamMember(userId: string) {
    const teamId = this.project.team.teamId;
    this.projectservice.deleteTeamMember(teamId, userId).subscribe(
      () => {
        // Successfully deleted team member
        this.project.team.usersWithRoles = this.project.team.usersWithRoles.filter(
          (user) => user.user.userId !== userId
        );
        console.log("Team member deleted successfully");
      },
      (error) => {
        console.error("Error deleting team member:", error);
      }
    );
  }
  
  
  
  
  
  

}
