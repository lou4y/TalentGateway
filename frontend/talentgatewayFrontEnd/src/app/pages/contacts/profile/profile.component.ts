import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';
import {AuthenticationService} from "../../../core/services/auth.service";
import { ChartType } from './profile.model';
import {User} from "../../../core/models/auth.models";
import {AdditionalUserData} from "../../../core/models/additional-user-data.model";
import {AdditionalUserDataService} from "../../../core/services/additional-user-data.service";
import {SkillsService} from "../../../core/services/skills.service";
import {Skill} from "../../../core/models/skill.model";
import {FileService} from "../../../core/services/file.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  revenueBarChart: ChartType;
  statData:any;
  user:User;
  userData:AdditionalUserData;
  skills:Skill[];
 Image: string;
  constructor( private authService: AuthenticationService, private fileService: FileService,private userDataService: AdditionalUserDataService,private skillsService:SkillsService) {
  }

   async ngOnInit() {
     this.breadCrumbItems = [{label: 'Profile'}, {label: 'Profile', active: true}];
     this.user = await this.authService.currentUser();
     this.userData = await this.userDataService.getAdditionalUserData(this.user.id).toPromise();
      this.skills = await this.skillsService.getUserSkills(this.user.id).toPromise();
     this.Image=await this.fileService.getImageFromFirestore(this.userData.profilePicture);

     // fetches the data
     this._fetchData();
     console.log(this.skills);
   }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}
