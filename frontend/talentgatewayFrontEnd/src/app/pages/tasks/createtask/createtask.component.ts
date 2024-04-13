import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'; // Correction des importations de FormBuilder et des formulaires

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, catchError, throwError } from 'rxjs';
import { Module } from 'src/app/core/models/module.model';
import { Tasks } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.scss']
})
export class CreatetaskComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  public Editor = ClassicEditor;

  form = new FormGroup({ // Correction du type de FormGroup
    member: new FormArray([ // Correction du type de FormArray
      new FormControl(''), // Correction du type de FormControl
    ]),
  });

  hidden: boolean;
  selected: any;

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  /**
   * Returns the form field value
   */
  get member(): FormArray { return this.form.get('member') as FormArray; }

  /**
   * Add the member field in form
   */
  addMember() {
    this.member.push(new FormControl()); // Correction du type de FormControl
  }

  /**
   * Onclick delete member from form
   */
  deleteMember(i: number) {
    this.member.removeAt(i);
  }

  taskStatus: string[];

  errorMessage!: string;
  modules: Module[] = [];
  selectedModule: Module | null = null;
  newTaskFormGroup!: FormGroup;
  taskForm: FormGroup;

  constructor(private taskService: TasksService, private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      taskName: [''],
      taskDescription: [''],
      startDate: [''],
      endDate: [''],
      priority: [''],
      moduleId: [''],
      moduleName: [''],
      userId: [''],
      firstName: new FormControl(''), // Correction du type de FormControl
      
    });

    console.log('Before API call');
    this.taskService.getModules().subscribe(
      (modules: Module[]) => {
        console.log('API call succeeded');
        this.modules = modules;
        console.log('Modules:', this.modules);
      },
      (error) => {
        console.error('API call failed:', error);
      }
    );
    console.log('After API call');
  }

  selectModule(module: Module) {
    this.selectedModule = module;
  }

  createTask() {
    if (this.taskForm.valid) {
      // Transform the dates to the expected format
      const formattedStartDate = this.datePipe.transform(this.taskForm.value.startDate, 'yyyy-MM-dd');
      const formattedEndDate = this.datePipe.transform(this.taskForm.value.endDate, 'yyyy-MM-dd');
  
      // Construct the task data with the correct structure
      const taskData: Tasks = {
        ...this.taskForm.value,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        module: {
          moduleName: this.taskForm.value.moduleName
        }
      };
  
    
      this.taskService.createTask(taskData).subscribe(
        response => {
          console.log('Task created successfully:', response);
          // Add logic for redirection or success message here
        },
        error => {
          console.error('Error creating task:', error);
        }
      );
    } else {
      console.error('Form is not valid');
    }
  }
  
}
