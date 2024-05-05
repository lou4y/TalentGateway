import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgOtpInputModule } from  'ng-otp-input';
import { ExtrapagesRoutingModule } from './extrapages-routing.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { Lockscreen2Component } from './lockscreen2/lockscreen2.component';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {NgStepperModule} from "angular-ng-stepper";
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AvatarModule} from "../shared/components/avatar/avatar.module";
import {MatIconModule} from "@angular/material/icon";
import { ImageCropperModule  } from 'ngx-image-cropper';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";


@NgModule({
  declarations: [MaintenanceComponent, Page404Component, Page500Component, LockscreenComponent, Lockscreen2Component,ComingsoonComponent],
  imports: [
    CommonModule,
    CarouselModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule,
    BsDropdownModule,
    NgSelectModule,
    CdkStepperModule,
    NgStepperModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    AvatarModule,
    MatIconModule,
    ImageCropperModule,
    BsDatepickerModule,
    FormsModule,
  ]
})
export class ExtrapagesModule { }
