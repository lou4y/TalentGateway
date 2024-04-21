import { Component, OnInit } from '@angular/core';
import { ImageServiceService } from '../../core/services/image-service.service';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {ImageCropperComponent} from "../../shared/components/avatar/components/image-cropper/image-cropper.component";
import {
  ControlValueAccessor,
  FormBuilder, FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup
} from "@angular/forms";
@Component({
  selector: 'app-confirm-profile-details',
  templateUrl: './confirm-profile-details.component.html',
  styleUrls: ['./confirm-profile-details.component.scss']
})
export class ConfirmProfileDetailsComponent implements OnInit,ControlValueAccessor {
  skillData: UntypedFormGroup;
  myForm: FormGroup;
  tunisiaStates: string[] = [
    'Ariana',
    'Beja',
    'Ben Arous',
    'Bizerte',
    'Gabes',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kebili',
    'Kef',
    'Mahdia',
    'Manouba',
    'Medenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan'
  ];
  file: string = '';
  constructor(public dialog: MatDialog,private fb: UntypedFormBuilder,private fbl: FormBuilder) {
    this.skillData = this.fb.group({
      skillValue: this.fb.array([]),
    });
    this.myForm = this.fb.group({
      gender: [''],
      birthdate: [''],
      address: [''],
      // Other form controls
    });
  }

  ngOnInit(): void {
    this.skilldata().push(this.skill());
  }
  skilldata(): UntypedFormArray {
    return this.skillData.get('skillValue') as UntypedFormArray;
  }

  skill(): UntypedFormGroup {
    return this.fb.group({
      skillname: ''
    });
  }
  addSkill() {
    this.skilldata().push(this.skill());
  }

  /**
   * Delete phone field from list
   * @param i specified index
   */
  deleteskill(i: number) {
    this.skilldata().removeAt(i);
  }

  writeValue(_file: string): void {
    this.file = _file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange = (fileUrl: string) => {};

  onTouched = () => {};

  disabled: boolean = false;

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openAvatarEditor(_file)
        .subscribe(
          (result) => {
            if(result){
              this.file = result;
              this.onChange(this.file);
            }
          }
        )
    }
  }

  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      data: image,
    });

    return dialogRef.afterClosed();
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }

  Showdata() {
    console.log(this.myForm.value);
  }
}
