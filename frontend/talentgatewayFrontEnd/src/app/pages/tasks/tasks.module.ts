import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DndModule } from 'ngx-drag-drop';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TasksRoutingModule } from './tasks-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

import { ListComponent } from './list/list.component';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [ListComponent, KanbanboardComponent, CreatetaskComponent],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    UIModule,
    PaginationModule.forRoot(),
    NgApexchartsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    CKEditorModule,
    DndModule,
    BsDropdownModule.forRoot()
  ]
})
export class TasksModule { }
