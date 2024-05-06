import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { User } from 'src/app/core/models/auth.models';
import { Module, Project } from 'src/app/core/models/module.model';
import { Tasks } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.scss']
})
export class CreatetaskComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  public Editor = ClassicEditor;

  form = new FormGroup({
    member: new FormArray([
      new FormControl('')
    ])
  });

  hidden: boolean;
  selectedStartDate: any;
  selectedEndtDate: any;

  selected : any;

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  get member(): FormArray { return this.form.get('member') as FormArray; }

  taskStatus: string[];
  errorMessage!: string;
  
  selectedModule: Module | null = null;

  newTaskFormGroup!: FormGroup;
  taskForm: FormGroup;
  moduleForm: FormGroup;

  modules: Module[] = [];
  projects: Project[] = [];
  users: User[] = []; // Add users array

  constructor(private taskService: TasksService, private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
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
    
  
    this.moduleForm = this.fb.group({
      moduleName: [''],  
      moduleDescription: [''],  
      projectId: [''],
      projectName: ['']
    });
  

    // Fetch all modules
    this.taskService.getModules().subscribe(
      (modules: Module[]) => {
        console.log('Modules API call succeeded');
        this.modules = modules;
        console.log('Modules:', this.modules);
      },
      (error) => {
        console.error('Modules API call failed:', error);
      }
    );
  
    // Fetch all projects
    this.taskService.getAllProjects().subscribe(
      (projects: Project[]) => {
        console.log('Projects API call succeeded');
        this.projects = projects;
        console.log('Projects:', this.projects);
      },
      (error) => {
        console.error('Projects API call failed:', error);
      }
    );
  

     // Fetch all users
     this.taskService.getAllUsers().subscribe(
      (users: User[]) => {
        console.log('Users API call of user succeeded');
        this.users = users;
        console.log('Users:', this.users);
      },
      (error) => {
        console.error('Users API call failed:', error);
      }
    );
  }
  

  createTask() {
    if (this.taskForm.valid) {
      const formattedStartDate = this.datePipe.transform(this.taskForm.value.startDate, 'yyyy-MM-dd');
      const formattedEndDate = this.datePipe.transform(this.taskForm.value.endDate, 'yyyy-MM-dd');

      const taskData: Tasks = {
        ...this.taskForm.value,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        firstName : this.taskForm.get('firstName').value,
        module: {
          moduleName: this.taskForm.value.moduleName
        }
      };

      this.taskService.createTask(taskData).subscribe(
        response => {
          console.log('API Call Successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Task created successfully!'
          }).then(() => {
            // Add logic for redirection or other actions here
          });
        },
        error => {
          console.log('API Call Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error creating task: ' + error.message
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Form is not valid'
      });
    }
  }

  createModule() {
    console.log('Create Module function called');
    
    if (this.moduleForm.valid) {
      console.log('Form is valid');
  
      const moduleData: Module = {
        moduleName: this.moduleForm.get('moduleName').value,
        moduleDescription: this.moduleForm.get('moduleDescription').value,
        projectId: 0, // Assuming this is a placeholder or you can set the actual project ID
        projectName: this.moduleForm.get('projectName').value,

        project: {
          projectId: 0, // Assuming this is a placeholder or you can set the actual project ID
          projectName: this.moduleForm.get('projectName').value,
        },
        moduleId: undefined,
        
      };
  
      console.log('Module Data:', moduleData);
  
      this.taskService.createModule(moduleData).subscribe(
        response => {
          console.log('API Call Successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Module created successfully!'
          }).then(() => {
            // Add logic for redirection or other actions here
          });
        },
        error => {
          console.log('API Call Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error creating module: ' + error.message
          });
        }
      );
    } else {
      console.log('Form is not valid');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Form is not valid'
      });
    }
  }
  
  
}
