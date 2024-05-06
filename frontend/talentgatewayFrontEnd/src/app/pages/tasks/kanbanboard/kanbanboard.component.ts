import { Component, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import {TaskKanban} from './kanabn.model'; 
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormGroup , FormBuilder } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TasksService } from 'src/app/services/tasks.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Module } from 'src/app/core/models/module.model';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { ChartType } from './kanabn.model';
import { EChartsOption } from 'echarts';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-kanbanboard',
  templateUrl: './kanbanboard.component.html',
  styleUrls: ['./kanbanboard.component.scss']
})

/**
 * Kanbanboard Component
 */
export class KanbanboardComponent implements OnInit {

  upcomingTasks: TaskKanban[] = [];
  inprogressTasks: TaskKanban[] = [];
  completedTasks: TaskKanban[] = [];
  alltask: TaskKanban[] = []; 

  tasks: TaskKanban[] = [];
  modules: Module[] = []; // To store modules from the backend
  status: any;
  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  taskForm!: UntypedFormGroup;

  taskFormCreate : FormGroup ;
  user: User;

  taskStats: any = {};

  taskChart: ChartType;
  pieChartOptions: EChartsOption = {};


  @ViewChild('modalForm', { static: false }) modalForm?: ModalDirective;
  @ViewChild('statsModal', { static: false }) statsModal?: ModalDirective;

  modalTitle: string = 'Add New Task';

  constructor(private formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private authService: AuthenticationService,
    private datePipe: DatePipe,
    private taskService: TasksService,
    private router: Router) { }

  async ngOnInit(): Promise<void>{

    this.user = await this.authService.currentUser();
      if (this.user) {
        if (this.user.role.includes('student')) {
    this.router.navigate(['/tasks/kanban']); 
  } else {
    this.router.navigate(['/pages/500']); 
  }

}
    this.taskFormCreate = this.fb.group({
      taskName: [''],
      taskDescription: [''],
      startDate: [''],
      endDate: [''],
      priority: [''],
      statut: [''],
      moduleId: [''],
      moduleName: [''],
      userId: [''],
      firstName:  ['']
    });
 
    this.loadTaskStats(this.user.id.toString());  // Load stats on component initialization
    this.setupPieChart();
  }

  loadTaskStats(userId: string): void {
    // Fetch the tasks first, since you need them to set up the charts
    this.tasksService.getTasksByUserId(userId).subscribe({
      next: (tasks) => {
        this.alltask = tasks;
        this.segregateTasksByStatus(); // Make sure this is called to update your upcoming, inprogress, and completed task arrays
        
        // Now fetch the task statistics if needed
        this.tasksService.getTaskStatsByUserId(userId).subscribe({
          next: (stats) => {
            this.taskStats = stats;
            console.log('Task stats loaded', stats);
            
            // Now that we have both tasks and stats, setup the charts
            this.setupChart(); // Setup the line/bar chart with the new data
            this.setupPieChart(); // Setup the pie chart with the new data
          },
          error: (error) => console.error('Error loading task stats:', error)
        });
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }
  
  

  loadTasksAndStats(userId: string): void {
    // Fetch the task statistics
    this.tasksService.getTaskStatsByUserId(userId).subscribe({
      next: (stats) => {
        this.taskStats = stats;
        console.log('Task stats loaded', stats);
        // After loading stats, fetch the tasks and setup the chart
        this.loadTasks(userId); // Call the method to load tasks
      },
      error: (error) => console.error('Error loading task stats:', error)
    });
  }
  

  setupChart(): void {
    const completedTasksByMonth = new Array(12).fill(0);

    this.alltask.forEach(task => {
      if (task.statut === 'Finished') {
        const monthIndex = this.getMonthFromTask(task);
        completedTasksByMonth[monthIndex]++;
      }
    });
    
    this.taskChart = {
      series: [{
        name: 'Completed Tasks',
        data: completedTasksByMonth
      }],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: true,
          tools: {
            zoom: false, // to hide the zoom tool
            reset: false, // to hide the reset tool
            
          }
        }
      },
      stroke: {
        curve: 'smooth',
        width: 1.5 // Adjust the width for thicker or thinner lines.
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
      }
    };
    
  }
  
  
  setupPieChart(): void {
    const taskStatusCounts = {
      'To_do': this.upcomingTasks.length,
      'In_Progress': this.inprogressTasks.length,
      'Finished': this.completedTasks.length
    };

    this.pieChartOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true, title: 'Save' }
        }
      },
      series: [
        {
          name: 'Tasks',
          type: 'pie',
          radius: '50%',
          data: [
            { value: taskStatusCounts['To_do'], name: 'To do' },
            { value: taskStatusCounts['In_Progress'], name: 'In Progress' },
            { value: taskStatusCounts['Finished'], name: 'Finished' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  getMonthFromTask(task: TaskKanban): number {
    const dateParts = task.endDate.split('-');
  const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 to get a zero-indexed month (0 for January, 11 for December)
    return month;
  }
  

  showStatsModal(): void {
    this.loadTaskStats(this.user.id.toString()); // Load or reload stats
    if (this.modalForm) {
      this.statsModal?.show(); // Shows the modal
    } else {
      console.error('Modal reference is not defined');
    }
  }



loadTasks(userId: string): void {
  this.tasksService.getTasksByUserId(userId).subscribe({
      next: (tasksFromAPI) => {
          this.alltask = tasksFromAPI.map(task => ({
              id: task.id,
              taskName: task.taskName,
              taskDescription: task.taskDescription,
              startDate: task.startDate,
              endDate: task.endDate,
              duration: task.duration,
              statut: task.statut,
              priority: task.priority,
              module: {
                  id: task.module.id,
                  moduleName: task.module.moduleName,
                  moduleDescription: task.module.moduleDescription
              },
              userId: task.userId,
              firstName: task.firstName
          })) as TaskKanban[]; // Convert each task to TaskKanban
          this.segregateTasksByStatus();
          this.setupPieChart();
          this.setupChart();
      },
      error: (error) => {
          console.error('Failed to fetch tasks:', error);
      }
  });
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
          this.tasksService.deleteTask(taskId).subscribe(
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
        event.target.closest('.card .task-box')?.remove();
      } else if (
        
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

  submitForm() {
    if (this.taskForm.valid) {
      const updatedTask = this.taskForm.value;
      // Call your service to update the task on the server
      this.tasksService.updateTask(updatedTask.id, updatedTask).subscribe({
        next: (result) => {
          // Update the task in your alltask array or re-fetch the tasks
          this.modalForm?.hide(); // Hide the modal after updating the task
        },
        error: (error) => {
          // Handle error
        },
      });
    }
  }

  // Call this method when the user saves the changes
  saveChanges() {
    // Here you would call a method from your tasksService to update the task
    // You need to pass the task id and the new task data
    if (this.taskForm.valid) {
      const updatedTask = this.taskForm.value;
      this.tasksService.updateTask(updatedTask.id, updatedTask).subscribe({
        next: (result) => {
          // Handle the successful update here
          this.modalRef?.hide(); // Hide the modal after saving changes
          // Update the task in the alltask array or re-fetch tasks from the backend
        },
        error: (error) => {
          // Handle errors here
        }
      });
    }
  }

  
  addnewTask(status: string) {
    this.taskForm.reset();
    this.taskForm.patchValue({ statut: status });
    switch (status) {
      case 'To_do': this.modalTitle = 'Add New Upcoming Task'; break;
      case 'In_Progress': this.modalTitle = 'Add New In Progress Task'; break;
      case 'Finished': this.modalTitle = 'Add New Completed Task'; break;
    }
    this.modalForm?.show();
  }

  
segregateTasksByStatus() {
  this.upcomingTasks = this.alltask.filter(t => t.statut === 'To_do');
  this.inprogressTasks = this.alltask.filter(t => t.statut === 'In_Progress');
  this.completedTasks = this.alltask.filter(t => t.statut === 'Finished');

}


mapStatus(statut: string): string {
  const statusMappings = {
    'In_Progress': 'In Progress',
    'Finished': 'Completed',
    'To_do': 'Upcoming'
  };
  return statusMappings[statut] || 'Unknown';
}


mapPriorityToStatus(priority: string): string { // Map priority to status
  const priorityMappings = {
    'HIGH': 'upcoming',
    'MEDIUM': 'inprogress',
    'LOW': 'completed'
  };
  return priorityMappings[priority] || 'upcoming';
}


   /**
   * on dragging task
   * @param item item dragged
   * @param list list from item dragged
   */
   onDragged(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
  }

  /**
   * On task drop event
   */
  onDrop(event: DndDropEvent, filteredList: TaskKanban[], targetStatus: string) {
    if (filteredList && event.dropEffect === 'move') {
      let index = event.index;
      const task: TaskKanban = event.data;  // Get the dragged task object
  
      if (typeof index === 'undefined') {
        index = filteredList.length;
      }
  
      task.statut = targetStatus;  // Update the status of the task
      filteredList.splice(index, 0, task);  // Add the task to its new list and position
  
      // Call the updateTask method to save the new status in the backend
      this.updateTaskStatus(task.id, task);
    }
  }
  
  updateTaskStatus(taskId: number, task: TaskKanban): void {
    this.tasksService.Save_Task_On_DragDrop(taskId, task).subscribe({
      next: (response) => console.log('Update successful', response),
      error: (error) => console.error('Error updating task', error)
    });
  }
 
}
