import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';
import { ContactsRoutingModule } from './contacts-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UsergridComponent } from './usergrid/usergrid.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import {NgStepperModule} from "angular-ng-stepper";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {MatIconModule} from "@angular/material/icon";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@NgModule({
  declarations: [UsergridComponent, UserlistComponent, ProfileComponent, ProfileSettingsComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    WidgetModule,
    UIModule,
    NgSelectModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    NgStepperModule,
    CdkStepperModule,
    MatIconModule,
    BsDatepickerModule
  ]
})
export class ContactsModule { }
