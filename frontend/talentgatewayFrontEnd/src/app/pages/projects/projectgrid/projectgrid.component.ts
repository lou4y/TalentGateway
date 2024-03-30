import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projectgrid',
  templateUrl: './projectgrid.component.html',
  styleUrls: ['./projectgrid.component.scss']
})
export class ProjectgridComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  total: Observable<number>;
  projects: Observable<Project[]>;
  page: any; // Define 'page' property

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Grid', active: true }];
    this.projects = this.projectService.getAllProjects() as Observable<Project[]>;
    // Calculate the total count of projects
    this.total = this.projects.pipe(
      map(projects => projects.length)
    );
  }
}
