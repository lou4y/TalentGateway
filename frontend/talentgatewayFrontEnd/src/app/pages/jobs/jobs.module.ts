import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UIModule } from '../../shared/ui/ui.module';

import {JobsRoutingModule} from "./jobs-routing.module";
import { ListComponent } from './list/list.component';
import { GridComponent } from './grid/grid.component';
import { ApplyComponent } from './apply/apply.component';
import { DetailsComponent } from './details/details.component';
import { CategoriesComponent } from './categories/categories.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateOverviewComponent } from './candidate-overview/candidate-overview.component';
import { AllapplicationComponent } from './allapplication/allapplication.component';
import { MyapplicationComponent } from './myapplication/myapplication.component';
import { ListInternshipsComponent } from './list-internships/list-internships.component';
import { AddInternshipsComponent } from './add-internships/add-internships.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { InternshipDetailsComponent } from './internship-details/internship-details.component';
import {RatingModule} from "ngx-bootstrap/rating";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import {ShareIconsModule} from "ngx-sharebuttons/icons";
import { UpdateInternshipComponent } from './update-internship/update-internship.component';

@NgModule({
  declarations: [
    ListComponent,
    GridComponent,
    ApplyComponent,
    DetailsComponent,
    CategoriesComponent,
    CandidateListComponent,
    CandidateOverviewComponent,
    AllapplicationComponent,
    MyapplicationComponent,
    ListInternshipsComponent,
    AddInternshipsComponent,
    InternshipDetailsComponent,
    UpdateInternshipComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    JobsRoutingModule,
    CKEditorModule,
    RatingModule,
    ShareButtonsModule,
    ShareIconsModule,
  ]
})

export class JobsModule { }
