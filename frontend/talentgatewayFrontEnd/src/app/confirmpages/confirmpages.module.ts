import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmProfileDetailsComponent } from './confirmProfileDetails/confirm-profile-details.component';
import { VerificationComponent } from './verification/verification.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgStepperModule} from "angular-ng-stepper";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {MatIconModule} from "@angular/material/icon";
import {NgSelectModule} from "@ng-select/ng-select";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@NgModule({
  declarations: [ConfirmProfileDetailsComponent,VerificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgStepperModule,
    CdkStepperModule,
    MatIconModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule
  ]
})
export class ConfirmpagesModule { }
