import { Component, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import {TaskKanban} from './kanabn.model'; 
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TasksService } from 'src/app/services/tasks.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Module } from 'src/app/core/models/module.model';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';

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

  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  taskForm!: UntypedFormGroup;

  user: User;

  taskStats: any = {};


  @ViewChild('modalForm', { static: false }) modalForm?: ModalDirective;
  @ViewChild('statsModal', { static: false }) statsModal?: ModalDirective;

  modalTitle: string = 'Add New Task';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private formBuilder: UntypedFormBuilder,
    private tasksService: TasksService,
    private authService: AuthenticationService) { }

  async ngOnInit(): Promise<void>{

    // this.loadTasks('f78c1770-902d-45e6-a0ef-c436ac762bc3');  

    this.user = await this.authService.currentUser();
    if (this.user) {
      this.loadTasks(this.user.id.toString());
    }
    
  

    this.taskForm = this.formBuilder.group({
      id: [null],
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: [],
      statut: ['', Validators.required],
      priority: ['', Validators.required],
      module: this.formBuilder.group({
        id: [null],
        moduleName: [''],
        moduleDescription: [''],
      }),
      userId: ['', Validators.required],
      firstName: [''],
    });

    this.loadModules();
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      taskDescription: [''],
      statut: ['', Validators.required], // Ensure this is linked correctly in the HTML
      endDate: ['', Validators.required] , // Adding endDate to the form group
      priority: ['', Validators.required], // Adding priority to the form group
      module: this.formBuilder.group({
        moduleName: ['', Validators.required]
      })
    }); 
    
    this.loadTaskStats(this.user.id.toString());  // Load stats on component initialization
  }

  loadTaskStats(userId: string): void {
    this.tasksService.getTaskStatsByUserId(userId).subscribe({
      next: (stats) => {
        this.taskStats = stats;
        console.log('Task stats loaded', stats);
      },
      error: (error) => console.error('Error loading task stats:', error)
    });
  }

  showStatsModal(): void {
    this.loadTaskStats(this.user.id.toString());  // Load or reload stats
    if (this.modalForm) {
      this.statsModal?.show();  // Shows the modal
    } else {
      console.error('Modal reference is not defined');
    }
  }

loadModules(): void {
  this.tasksService.getModules().subscribe(
    modules => this.modules = modules,
    error => console.error('Error loading modules:', error)
  );
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
      },
      error: (error) => {
          console.error('Failed to fetch tasks:', error);
      }
  });
}

createTask() {
  // API call
  this.tasksService.createTask(this.taskForm.value).subscribe({
    next: response => {
      console.log('Task created successfully', response);
      this.modalForm?.hide();
    },
    error: error => {
      console.error('Failed to create task', error);
    }
  });
}

submitTask() {
  if (this.taskForm.valid) {
    this.createTask();
  } else {
    console.error('Form is not valid:', this.taskForm.errors);
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

   // Update task method
   updateTask(index: number) {
    const task = this.alltask[index];
    this.taskForm.patchValue({
      id: task.id,
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      // ... other task properties
    });

    // This opens the modal form
    this.modalForm?.show();

    // If your modal component is defined within the same component, you can simply show it using ViewChild
   
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

  console.log('Upcoming Tasks:', this.upcomingTasks);
  console.log('In Progress Tasks:', this.inprogressTasks);
  console.log('Completed Tasks:', this.completedTasks);
}


mapStatus(statut: string): string {
  const statusMappings = {
    'In_Progress': 'In Progress',
    'Finished': 'Completed',
    'To_do': 'Upcoming'
  };
  return statusMappings[statut] || 'Unknown';
}


mapPriorityToStatus(priority: string): string {
  // Since priority isn't status, you might need a different approach to display priority
  // but here is a direct mapping if it's needed
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
  


 
  /*

  // add new tak  
  addnewTask(status: any) {
    this.status = status
    this.modalForm.show()
  }

  // Save Form
  submitForm() {
    if (this.taskForm.valid) {
      if (this.taskForm.get('id')?.value) {
        this.alltask = tasks.map((data: { id: any; }) => data.id === this.taskForm.get('id')?.value ? { ...data, ...this.taskForm.value } : data)
      } else {
        const title = this.taskForm.get('taskname')?.value;
        const desc = this.taskForm.get('taskdesc')?.value;
        const task = this.taskForm.get('taskstatus')?.value;
        const budget = this.taskForm.get('taskbudget')?.value;
        const user = []
        for (var i = 0; i < this.memberLists.length; i++) {
          if (this.memberLists[i].checked == true) {
            user.push(this.memberLists[i].profile)
          }
        }
        tasks.push({
          id: tasks.length + 1,
          date: '14 Oct, 2019',
          title,
          task,
          user,
          status: this.status,
          budget
        })
    
      }
    }
    this._fetchData();
    this.taskForm.reset();
    this.modalForm.hide()
  }

  // Update Task
  updateTask(id: any) {
    this.submitted = false;
    this.modalForm?.show()

    var updatetitle = document.querySelector('.modal-title') as HTMLAreaElement
    updatetitle.innerHTML = "Update Task";

    var updatebtn = document.getElementById('addtask') as HTMLAreaElement
    updatebtn.innerHTML = "Update Task";

    var data = tasks[id]
    this.taskForm.controls['id'].setValue(data.id);
    this.taskForm.controls['taskname'].setValue(data.title);
    this.taskForm.controls['taskstatus'].setValue(data.task);
    this.taskForm.controls['taskbudget'].setValue(data.budget);
    // Compare data.user profile and memberList profile if same the set checked property to true
    for (var i = 0; i < this.memberLists.length; i++) {
      for (var x = 0; x < data.user.length; x++) {
        if (this.memberLists[i].profile == data.user[x]) {
          this.memberLists[i].checked = true;
          // this.taskForm.controls['taskassignee'].setValue( this.memberLists[i].id);
        }
      }
    }

  }
  */



}