import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, throwError } from 'rxjs';
import { Observable, catchError } from 'rxjs';

import {  Tasks } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  tasks!: Observable<Array<Tasks>>;
  errorMessage!: string;
  searchFormGroup!: FormGroup;

  currentPage = 1;
  totalPages = 10;
  itemsPerPage = 10;

  page = 1;
  breadCrumbItems: Array<{}>;
  totalItems = 100;

  showQualificationList: boolean = false;
  selectedPriority: string | null = null;
  selectedStatus: string | null = null;

  sortByDate: boolean = false;

  constructor(
    private taskService: TasksService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });

    this.fetchAllTasks();
    
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });

    this.selectedPriority = "ALL"; // Initialiser selectedPriority à "ALL"
    this.selectedStatus = "ALL"; // Initialiser selectedStatus à "ALL"
    this.fetchAllTasks();
  }

  handleSearchTasks(): void {
    let kw = this.searchFormGroup?.value.keyword;
    this.tasks = this.taskService.searchTasks(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
  
  onSearch(): void {
    this.handleSearchTasks();
  }

  fetchAllTasks(): void {
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    this.tasks = this.taskService.getAllTasks(skip, this.itemsPerPage).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  pageChanged(event: any): void {
    this.page = event.page;
  }

  toggleQualificationList(): void {
    if (this.selectedPriority === 'ALL' && this.selectedStatus === 'ALL') {
      this.fetchAllTasks();
    } else {
      this.applyFilters();
    }
  
    // Appliquer le tri par date si activé
    if (this.sortByDate) {
      this.sortTasksByDate();
    }
  
    // Mettre à jour la valeur de showQualificationList
    this.showQualificationList = !this.showQualificationList;
    

  }
  
  

  
toggleSortByDate(event: any): void {
  this.sortByDate = event.target.checked;
  
  // Appliquer le tri et/ou le filtrage seulement si le filtre est ouvert
  if (this.showQualificationList) {
      this.toggleQualificationList();
  } else {
      this.sortTasksByDate();
  }

  this.sortByDate = event.target.checked;
  
  if (this.showQualificationList) {
    this.applyFilters();
  } else {
    this.sortTasksByDate();
  }
}

  
  
filterTasksByPriority(): void {
  if (this.selectedPriority === 'ALL') {
    this.fetchAllTasks();
  } else {
    this.tasks = this.taskService.getTasksByPriority(this.selectedPriority).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  // Appliquer le tri par date si activé
  if (this.sortByDate) {
    this.sortTasksByDate();
  }
}



  
sortTasksByDate(): void {
  this.tasks = this.tasks.pipe(
    map(tasks => tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())),
    catchError(err => {
      this.errorMessage = err.message;
      return throwError(err);
    })
  );
}

filterTasksByStatus(): void {
  if (this.selectedStatus === 'ALL' || !this.selectedStatus) {
    this.fetchAllTasks();
  } else {
    this.tasks = this.taskService.getTasksByStatus(this.selectedStatus).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
}

applyFilters(): void {
  if (this.selectedPriority === 'ALL' && this.selectedStatus === 'ALL') {
    this.fetchAllTasks();
  } else if (this.selectedPriority !== 'ALL' && this.selectedStatus === 'ALL') {
    this.filterTasksByPriority();
  } else if (this.selectedPriority === 'ALL' && this.selectedStatus !== 'ALL') {
    this.filterTasksByStatus();
  } else {
    this.filterTasksByPriorityAndStatus();
  }

  // Appliquer le tri par date si activé
  if (this.sortByDate) {
    this.sortTasksByDate();
  }
}

filterTasksByPriorityAndStatus(): void {
  this.tasks = this.taskService.getTasksByPriorityAndStatus(this.selectedPriority, this.selectedStatus).pipe(
    catchError(err => {
      this.errorMessage = err.message;
      return throwError(err);
    })
  );
}
  
  }
