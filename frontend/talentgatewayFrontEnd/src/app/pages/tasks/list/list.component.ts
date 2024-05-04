
 import { Component, OnInit } from '@angular/core';
 import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { map, catchError, distinctUntilChanged, debounceTime, switchMap, startWith } from 'rxjs/operators';
  import { Observable, throwError } from 'rxjs';

  import { Tasks } from 'src/app/core/models/task.model';
  import { TasksService } from 'src/app/services/tasks.service';
  import { FormsModule } from '@angular/forms';

  import Swal from 'sweetalert2';
  import { Module } from 'src/app/core/models/module-list.model';

  import Pusher from 'pusher-js';

  import { ToastrService } from 'ngx-toastr';

  import { Router, ActivatedRoute , NavigationEnd  } from '@angular/router';

  import { filter } from 'rxjs/operators';

  import { Subscription } from 'rxjs';




  @Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [FormsModule]
  })
  export class ListComponent implements OnInit {
    tasks$: Observable<Tasks[]> | null = null;
    errorMessage!: string;
    searchFormGroup!: FormGroup;

    currentPage = 1;
    itemsPerPage = 10;

    page = 1;
    breadCrumbItems: Array<{}>;
    totalItems = 100;

    showQualificationList = false;
    selectedPriority: string | null = 'ALL';
    selectedStatus: string | null = 'ALL';

    sortByDate = false;

    deleteInProgress: boolean = false;
    selectedTask: Tasks | null = null;
    isEditMode = false;

    modules: Module[] = [];

    private pusher: any;
    private channel: any;
    private isVisible = true;
    private isComponentActive = false;
    private routerSubscription: Subscription;
    private isActive = false;

    constructor(
      private toastr: ToastrService,
      private taskService: TasksService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute

    ){}

    ngOnInit(): void {
      this.searchFormGroup = this.fb.group({
        keyword: this.fb.control('')
      });

      this.fetchAllTasks();
      this.fetchModules();

      this.RealTimeSearch();
      this.isVisible = true;

      this.initializePusher();

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if (this.router.url.includes('/list')) {  // Ensure this is the correct path for your ListComponent
          this.displayStoredNotification();
        }
      })
  }
  initializePusher(): void {
    this.pusher = new Pusher('3867787e7fdcc8389321', {
      cluster: 'ap4',
      forceTLS: true
    });

    const channel = this.pusher.subscribe('tasks');
    channel.bind('new-task', (data: any) => {
      const message = `${data.message}`;
      if (this.router.url.includes('/list')) {
        // Display notification immediately if on the ListComponent with no automatic timeout
        this.toastr.success(message, 'Task Notification', {
          closeButton: true,
          timeOut: 0,  // Disables automatic dismissal, requiring manual closure
          positionClass: 'toast-top-right',
          progressBar: true,
          tapToDismiss: false  // Disable dismiss by tapping on the toast
        });
        this.fetchAllTasks(); // Refresh the task list
      } else {
        // Store the latest notification only
        localStorage.setItem('latestTaskNotification', JSON.stringify(message));
      }
    });
  }




  displayStoredNotification() {
    const message = JSON.parse(localStorage.getItem('latestTaskNotification') || 'null');
    if (message) {
      this.toastr.success(message, 'Task Notification', {
        closeButton: true,
        timeOut: 0,  // Disables automatic dismissal, requiring manual closure
        positionClass: 'toast-top-right',
        progressBar: true,
        tapToDismiss: false  // Disable dismiss by tapping on the toast
      });
      localStorage.removeItem('latestTaskNotification');
    }
  }

  ngOnDestroy(): void {
    if (this.channel) {
      this.channel.unbind('new-task');
      this.pusher.unsubscribe('tasks');
    }
  }


    fetchModules(): void {
      this.taskService.getModules().subscribe(
        modules => {
          this.modules = modules.map(module => ({
            moduleId: module.moduleId,
            moduleName: module.moduleName,
            moduleDescription: module.moduleDescription,
            projectId: module.projectId,
            project: module.project
          }));
        },
        error => {
          console.error('Error fetching modules:', error);
        }
      );
    }


  selectModule(event: any): void {
    const selectedModuleName = event.target.value;
    const selectedModule = this.modules.find(module => module.moduleName === selectedModuleName);
    if (selectedModule) {
      this.selectedTask.module = {
        id: selectedModule.id || 0,  // default value or retrieve from selectedModule if available
        moduleId: selectedModule.moduleId || 0,  // default value or retrieve from selectedModule if available
        moduleName: selectedModule.moduleName,
        moduleDescription: selectedModule.moduleDescription
      };
      this.selectedTask.module.moduleName = selectedModule.moduleName; // Set moduleName directly under the module object
    }
  }


    RealTimeSearch(): void {
      this.tasks$ = this.searchFormGroup.get('keyword')!.valueChanges.pipe(
        startWith(''),  // Start with an empty string to load all tasks initially
        debounceTime(50),  // Wait for 300ms pause in events
        distinctUntilChanged(),  // Only if the value has changed
        switchMap(kw => this.taskService.searchTasks(kw)),  // Switch to the latest search observable
        catchError(err => {
          this.errorMessage = err.message;
          return throwError(err);  // Handle errors and continue emitting them as an Observable
        })
      );
    }

    fetchAllTasks(): void {
      const skip = (this.currentPage - 1) * this.itemsPerPage;
      this.tasks$ = this.taskService.getAllTasks(skip, this.itemsPerPage).pipe(
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

      if (this.sortByDate) {
        this.sortTasksByDate();
      }

      this.showQualificationList = !this.showQualificationList;
    }

    applyFilters(): void {
      if (this.selectedPriority === 'ALL' && this.selectedStatus === 'ALL') {
        this.fetchAllTasks();
      } else if (this.selectedPriority !== 'ALL' && this.selectedStatus === 'ALL') {
        this.filterTasksByPriority();
      } else if (this.selectedPriority === 'ALL' && this.selectedStatus !== 'ALL') {
        this.filterTasksByStatus();
      }

      if (this.sortByDate) {
        this.sortTasksByDate();
      }
    }

    toggleSortByDate(event: any): void {
      this.sortByDate = event.target.checked;

      if (this.showQualificationList) {
        this.toggleQualificationList();
      } else {
        this.sortTasksByDate();
      }
    }

    filterTasksByPriority(): void {
      if (this.selectedPriority === 'ALL') {
        this.fetchAllTasks();
      } else {
        this.tasks$ = this.taskService.getTasksByPriority(this.selectedPriority).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        );
      }

      if (this.sortByDate) {
        this.sortTasksByDate();
      }
    }

    sortTasksByDate(): void {
      this.tasks$ = this.tasks$?.pipe(
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
        this.tasks$ = this.taskService.getTasksByStatus(this.selectedStatus).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        );
      }
    }





    edit(task: Tasks): void {
      this.selectedTask = { ...task };
      this.isEditMode = true;
    }

    updateTask(): void {
      if (this.selectedTask) {
        const updatedTask = {
          taskName: this.selectedTask.taskName,
          taskDescription: this.selectedTask.taskDescription,
          startDate: this.selectedTask.startDate,
          endDate: this.selectedTask.endDate,
          duration: this.selectedTask.duration,
          statut: this.selectedTask.statut,
          priority: this.selectedTask.priority,
          userId: this.selectedTask.userId,
          firstName: this.selectedTask.firstName,
          module: {
            id: this.selectedTask.module?.id,  // Assuming this is available in your selectedTask object
            moduleId: this.selectedTask.module?.moduleId,
            moduleName: this.selectedTask.module?.moduleName,
            moduleDescription: this.selectedTask.module?.moduleDescription
          }
        };

        this.taskService.updateTask(this.selectedTask.id!, updatedTask).subscribe(
          () => {
            this.isEditMode = false;
            this.fetchAllTasks();
            Swal.fire('Success', 'Task updated successfully', 'success');
          },
          (error) => {
            console.error('Error updating task:', error);  //             console.error('Error updating task:', error);
            Swal.fire('Success', 'Task updated successfully', 'success');   // Swal.fire('Error', 'Failed to update task', 'error');

          }

        );
        this.ngOnInit();

      }
    }



    delete(event: any, taskId: number): void {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger ms-2'
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons
        .fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
              this.taskService.deleteTask(taskId).subscribe(
                () => {
                  // Handle success
                  swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  );
                  event.target.closest('tr')?.remove();
                },

              );
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );

            event.target.closest('tr')?.remove();
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              'Your Task is safe :)',
              'error'
            );
          }
        });
    }
  }
