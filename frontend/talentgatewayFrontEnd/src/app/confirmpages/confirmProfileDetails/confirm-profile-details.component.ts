import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {ImageCropperComponent} from "../../shared/components/avatar/components/image-cropper/image-cropper.component";
import {
  ControlValueAccessor,
  FormBuilder,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup
} from "@angular/forms";
import {FileService} from "../../core/services/file.service";
import {AdditionalUserData} from "../../core/models/additional-user-data.model";
import {AuthenticationService} from "../../core/services/auth.service";
import {User} from "../../core/models/auth.models";
import {AdditionalUserDataService} from "../../core/services/additional-user-data.service";
import {Skill} from "../../core/models/skill.model";
import {SkillsService} from "../../core/services/skills.service";
import {ProfileVerificationService} from "../../core/services/profile-verification.service";
import {UserVerif} from "../../core/models/UserVerificationData.model";
import {Router} from "@angular/router";
@Component({
  selector: 'app-confirm-profile-details',
  templateUrl: './confirm-profile-details.component.html',
  styleUrls: ['./confirm-profile-details.component.scss']
})
export class ConfirmProfileDetailsComponent implements OnInit,ControlValueAccessor {

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
  Image: string = '';
  Birthdate: any;
  Address:  string = '';
  City:  string = '';
  State:  string = '';
  description: string ="";
  PDFfile: File | null = null;
  phoneNumber: string = '';
  selectedGender: string = '';
  skillData: UntypedFormGroup;
  fileError: boolean = false;
  phoneNumberError: boolean = false;
  disabled: boolean = false;
   user: User;
  constructor(public dialog: MatDialog,private authService: AuthenticationService,private dataservice:AdditionalUserDataService,private userverif: ProfileVerificationService,private Skillservice: SkillsService,private fb: UntypedFormBuilder,private fbl: FormBuilder,private fileService: FileService, private authservice: AuthenticationService,private router: Router) {
    this.skillData = this.fb.group({
      skillValue: this.fb.array([]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.skilldata().push(this.skill());
    await this.authService.currentUser().then((user) => {
      this.user = user;
    });
  }
  skilldata(): UntypedFormArray {
    return this.skillData.get('skillValue') as UntypedFormArray;
  }

  skill(): UntypedFormGroup {
    return this.fb.group({
      skillname: '',
      skilllevel: 'BEGINNER',
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
    this.Image = _file;
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



  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openAvatarEditor(_file)
        .subscribe(
          (result) => {
            if(result){
              this.Image = result;
              this.onChange(this.Image);
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


  onFileSelected(event: any) {
    const selectedFile: File = event.target.files[0];

    // Check if file is a PDF
    if (selectedFile && selectedFile.type === 'application/pdf') {
      this.PDFfile = selectedFile;
      this.fileError = false;
    } else {
      // File is not a PDF
      this.PDFfile = null;
      this.fileError = true;
    }
  }
  validatePhoneNumber() {
    // Remove non-numeric characters
    let cleanedPhoneNumber = this.phoneNumber.replace(/\D/g, '');

    // Check if phone number has exactly 8 digits
    if (cleanedPhoneNumber.length === 8 && /^\d+$/.test(cleanedPhoneNumber)) {
      this.phoneNumberError = false;
    } else {
      this.phoneNumberError = true;
    }
  }

  async saveData() {
    var user : User = await this.authservice.currentUser();
    var imageUrl = this.Image;
    try {
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = async () => {
            const base64String = reader.result as string;
            const imageBlob = this.dataURItoBlob(base64String);
            const uploadedImageUrl = await this.fileService.uploadImageBlob(imageBlob);
            resolve(uploadedImageUrl);
          };
          reader.readAsDataURL(blob);
        });
      }
      const pdfUrl = await this.fileService.uploadPDF(this.PDFfile);
      const userData: AdditionalUserData = {
        userId: user.id ,
        address: this.Address,
        city: this.City,
        state: this.State,
        description: this.description,
        phoneNumber: this.phoneNumber,
        gender: this.selectedGender,
        profilePicture: imageUrl,
        pdfFile: pdfUrl,
        birthdate: this.Birthdate
      };

      for (let i = 0; i < this.skilldata().length; i++) {
        const skill = this.skilldata().at(i) as UntypedFormGroup;
        let savedskill :Skill= {
          id: '',
          skillName: skill.get('skillname')?.value,
          skillLevel: skill.get('skilllevel')?.value,
          userId: user.id
        }
        this.Skillservice.createSkill(savedskill).subscribe();
        console.log('Skill saved successfully.');

      }

      let userVerificationData: UserVerif = await this.userverif.getUserVerification(this.user.id.toString()).toPromise();
      userVerificationData.dataVerified = true;
      this.userverif.updateUserVerification(userVerificationData).subscribe(() => {
        console.log('User verification data updated successfully.');
        this.router.navigate(['/']);
      });

      console.log(userData);
      this.dataservice.createAdditionalUserData(userData).subscribe();
      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
