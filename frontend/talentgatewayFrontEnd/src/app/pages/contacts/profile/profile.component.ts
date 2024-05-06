import { Component, OnInit } from '@angular/core';
import { revenueBarChart as defaultRevenueBarChart } from './data';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ChartType } from './profile.model';
import { User } from 'src/app/core/models/auth.models';
import { AdditionalUserData } from 'src/app/core/models/additional-user-data.model';
import { AdditionalUserDataService } from 'src/app/core/services/additional-user-data.service';
import { SkillsService } from 'src/app/core/services/skills.service';
import { Skill } from 'src/app/core/models/skill.model';
import { FileService } from 'src/app/core/services/file.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // Bread crumb items
  breadCrumbItems: Array<{}>;

  // User information
  user: User;
  userData: AdditionalUserData;
  skills: Skill[] = [];
  Image: string;

  // Project statistics
  projects: any[] = [];
  statData: any[];
  completedProjectsCount = 0;
  inProgressProjectsCount = 0;
  totalRevenue = 0;

  // Revenue bar chart
  revenueBarChart: ChartType;

  constructor(
    private authService: AuthenticationService,
    private fileService: FileService,
    private userDataService: AdditionalUserDataService,
    private skillsService: SkillsService,
    private projectService: ProjectService
  ) {
    this.revenueBarChart = { ...defaultRevenueBarChart }; // Initialize the chart
  }

  async ngOnInit() {
    this.breadCrumbItems = [{ label: 'Profile' }, { label: 'Profile', active: true }];

    // Fetch user information and additional data
    this.user = await this.authService.currentUser();
    this.userData = await this.userDataService.getAdditionalUserData(this.user.id).toPromise();
    //console.log("user data",this.userData);
    this.skills = await this.skillsService.getUserSkills(this.user.id).toPromise();
    this.Image = await this.fileService.getImageFromFirestore(this.userData.profilePicture);

    if (this.user && this.user.id) {
      this.projectService.getProjectByCreatorId(this.user.id).subscribe(
        (projects: any[]) => {
          this.projects = projects;

          // Calculate statistics
          this.calculateProjectStatistics(projects);
          this.calculateRevenueBarChart(projects);
        },
        (error) => {
          console.error('Error fetching projects:');
        }
      );
    }

    this._fetchData();
  }

  private calculateProjectStatistics(projects: any[]) {
    const completedProjects = projects.filter(
      (project) => project.projectStatus === 'COMPLETED'
    ).length;

    const pendingProjects = projects.filter(
      (project) => project.projectStatus === 'IN_PROGRESS'
    ).length;

    const totalRevenue = projects.reduce(
      (acc, project) => acc + (project.price || 0),
      0
    );

    this.statData = [
      {
        icon: 'bx bx-check-circle',
        title: 'Completed Projects',
        value: completedProjects.toString(),
      },
      {
        icon: 'bx bx-hourglass',
        title: 'Pending Projects',
      value: pendingProjects.toString(),
      },
      {
        icon: 'bx bx-package',
        title: 'Total Revenue',
        value: `$${totalRevenue.toFixed(2)}`,
      },
    ];
  }

  private calculateRevenueBarChart(projects: any[]) {
    // Prepare a map to store the revenue for each month
    const monthlyRevenue: { [key: string]: number } = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    projects.forEach((project) => {
      const startMonth = new Date(project.startDate).toLocaleString('en', { month: 'short' });
      const price = project.price || 0;

      if (monthlyRevenue[startMonth] !== undefined) {
        monthlyRevenue[startMonth] += price;
      }
    });

    // Create a series data array from the monthlyRevenue map
    const revenueSeries = Object.keys(monthlyRevenue).map((month) => monthlyRevenue[month]);

    // Update the revenueBarChart with the calculated data
    this.revenueBarChart = {
      ...defaultRevenueBarChart,
      series: [{ name: 'Revenue', data: revenueSeries }],
    };
  }

  private _fetchData() {
    this.revenueBarChart = { ...defaultRevenueBarChart }; // Re-initialize chart
  }
}
