import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import {AvatarComponent} from "./avatar.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {MatIconModule} from "@angular/material/icon";
@NgModule({
  declarations: [
    AvatarComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImageCropperModule,
    MatIconModule,
  ],
  exports: [
    AvatarComponent
  ]
})
export class AvatarModule { }
