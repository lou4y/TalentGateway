import { Component } from '@angular/core';
import { overviewBarChart } from '../../../pages/projects/overview/data';

import { ChartType } from '../../../pages/projects/overview/overview.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.scss']
})
export class DetailProjectComponent {
  project={projectId:'',projectName:'',projectDescription:'',startDate:'',endTime:'',price:0, projectStatus:'',projectCreator:{
    userId:'',firstName:'',email:'',lastName:'',userRole:''},team:{
      teamId:0,name:'',usersWithRoles:[{user:{firstName:'',lastName:''},memberRole:''}]
    }};
  breadCrumbItems: Array<{}>;
  projectId: any;
  overviewBarChart: ChartType;
  numberOfLikes: any;

  constructor(private activatedroute: ActivatedRoute, private projectservice: ProjectService) { }

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

}
