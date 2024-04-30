import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexLegend,
} from 'ng-apexcharts';
import { ProjectService } from 'src/app/services/project.service';
import { CommentsService } from 'src/app/services/comments.service';
import { TeamService } from 'src/app/services/team.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  labels?: string[];
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  title?: ApexTitleSubtitle;
};

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  public barChartOptions: Partial<ChartOptions>;
  public pieChartOptions: Partial<ChartOptions>;
  public horizontalBarChartOptions: Partial<ChartOptions>; // Horizontal bar chart for top liked projects
  private projects: any[];
  public totalProjects: number = 0;
  public totalComments: number = 0;
  public totalLikes: number = 0;
  public totalTeams: number = 0;

  constructor(
    private projectService: ProjectService,
    private commentsService: CommentsService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.loadData(); // Load all data
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      this.initializeCharts(); // Initialize all charts
    });

    this.projectService.getAllLikes().subscribe((likes) => {
      const projectLikeCounts = this.countLikesByProject(likes);
      this.initializeHorizontalBarChart(projectLikeCounts); // Initialize the horizontal bar chart
    });
  }

  loadData() {
    // Get total counts for projects, comments, and likes
    this.projectService.getAllProjects().subscribe((projects) => {
      this.totalProjects = projects.length;
    });

    this.commentsService.getAllComments().subscribe((comments) => {
      this.totalComments = comments.length;
    });

    this.projectService.getAllLikes().subscribe((likes) => {
      this.totalLikes = likes.length;
    });
    this.teamService.getTeams().subscribe((teams) =>{
      this.totalTeams= teams.length;
    })
  }

  initializeCharts() {
    this.initializeBarChart(); // Initialize bar chart for projects by month
    this.initializePieChart(); // Initialize pie chart for projects by status
  }

  initializeBarChart() {
    const projectsByMonth = this.countProjectsByMonth(); // Get projects by month

    this.barChartOptions = {
      series: [
        {
          name: 'Projects',
          data: projectsByMonth,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      title: {
        text: 'Projects by Month',
      },
    };
  }

  initializePieChart() {
    const projectsByStatus = this.countProjectsByStatus(); // Get projects by status

    this.pieChartOptions = {
      series: Object.values(projectsByStatus),
      chart: {
        type: 'pie',
        height: 350,
      },
      labels: Object.keys(projectsByStatus),
      title: {
        text: 'Projects by Status',
      },
    };
  }

  initializeHorizontalBarChart(projectLikeCounts: { [key: string]: number }) {
    const topProjects = Object.entries(projectLikeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4); // Get the top 4 most liked projects

    this.horizontalBarChartOptions = {
      series: [
        {
          name: 'Likes',
          data: topProjects.map(([_, count]) => count),
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '55%',
        },
      },
      xaxis: {
        categories: topProjects.map(([projectId, _]) => projectId),
      },
    };
  }

  countLikesByProject(likes: any[]): { [key: string]: number } {
    const likeCounts: { [key: string]: number } = {};

    likes.forEach((like) => {
      const projectId = like.project.projectId;
      if (!likeCounts[projectId]) {
        likeCounts[projectId] = 1;
      } else {
        likeCounts[projectId] += 1;
      }
    });

    return likeCounts;
  }

  countProjectsByMonth() {
    const projectCount = Array(12).fill(0);
    this.projects.forEach((project) => {
      const startDate = new Date(project.startDate);
      const month = startDate.getMonth();
      projectCount[month] += 1;
    });
    return projectCount;
  }

  countProjectsByStatus() {
    const projectStatusCount: { [key: string]: number } = {};

    this.projects.forEach((project) => {
      const status = project.projectStatus;
      if (projectStatusCount[status]) {
        projectStatusCount[status] += 1;
      } else {
        projectStatusCount[status] = 1;
      }
    });

    return projectStatusCount;
  }
}
