import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup
} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../core/services/file.service";
import {Observable} from "rxjs";
import {ImageCropperComponent} from "../../../shared/components/avatar/components/image-cropper/image-cropper.component";
import {AdditionalUserData} from "../../../core/models/additional-user-data.model";
import {AuthenticationService} from "../../../core/services/auth.service";
import {AdditionalUserDataService} from "../../../core/services/additional-user-data.service";
import {SkillsService} from "../../../core/services/skills.service";
import {Skill} from "../../../core/models/skill.model";
import {Kuser, User} from "../../../core/models/auth.models";
import {UsersService} from "../../../core/services/users.service";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit{
  breadCrumbItems: Array<{}>;
  FirstName: any;
  LastName: any;
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
  Email: any;
  user: User;
  userData: AdditionalUserData;
  skills: Skill[];
  constructor( public dialog: MatDialog,private userservice:UsersService ,private fb: UntypedFormBuilder,private fileService: FileService,private authService: AuthenticationService, private userDataService: AdditionalUserDataService,private skillsService:SkillsService) {
    this.skillData = this.fb.group({
      skillValue: this.fb.array([]),
    });
  }
  async ngOnInit(): Promise<void> {

    this.breadCrumbItems = [{label: 'Settings'}, {label: 'Profile ', active: true}];
    this.user = await this.authService.currentUser();
    this.userData = await this.userDataService.getAdditionalUserData(this.user.id).toPromise();
    this.skills = await this.skillsService.getUserSkills(this.user.id).toPromise();
    this.FirstName = this.user.firstName;
    this.LastName = this.user.lastName;
    this.Email = this.user.email;

    if (this.userData != null) {
      this.Address = this.userData.address;
      this.City = this.userData.city;
      this.State = this.userData.state;
      this.description = this.userData.description;
      // Assuming this.userData.phoneNumber is a string
      this.phoneNumber = this.userData.phoneNumber
      this.selectedGender = this.userData.gender;
      const birthdate = this.userData.birthdate; // Assuming this.userData.birthdate is your date string
      const parts = birthdate.split('-');
      this.Birthdate = parts[1] + '/' + parts[2] + '/' + parts[0];
      this.skills.forEach(skill => {
        this.addSkill(skill.id,skill.skillName, skill.skillLevel);
      });
      this.Image = await this.fileService.getImageFromFirestore(this.userData.profilePicture);
      console.log(this.userData);
    }
  }

  // Add skill group
  addSkill(id:string ='', skillname: string = '', skilllevel: string = 'BEGINNER') {
    this.skilldata().push(this.fb.group({
      id:id,
      skillname: skillname,
      skilllevel: skilllevel
    }));
  }

  // Delete skill group at index
  deleteskill(index: number) {
    this.skilldata().removeAt(index);
  }

  // Helper method to get skillData form array
  skilldata(): FormArray {
    return this.skillData.get('skillValue') as FormArray;
  }

  // Helper method to get skillData form group
  skill(): FormGroup {
    return this.fb.group({
      id: '',
      skillname: '',
      skilllevel: 'BEGINNER',
    });
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
    let imageUrl = this.Image;
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

      let pdfUrl: string;
      if (this.PDFfile === null) {
        pdfUrl = this.userData.pdfFile;
      } else {
        pdfUrl = await this.fileService.uploadPDF(this.PDFfile);
      }
      const birthdate = this.userData.birthdate; // Assuming this.userData.birthdate is your date string
      const parts = birthdate.split('-');
      const birth = parts[1] + '/' + parts[2] + '/' + parts[0];
      if (this.Birthdate==birth) {
        this.Birthdate = this.userData.birthdate;
      }


      this.userData.pdfFile = pdfUrl;
      this.userData.address = this.Address;
      this.userData.city = this.City;
      this.userData.state = this.State;
      this.userData.description = this.description;
      this.userData.phoneNumber = this.phoneNumber;
      this.userData.gender = this.selectedGender;
      this.userData.birthdate = this.Birthdate;
      this.userData.profilePicture = imageUrl;

      const kuser :Kuser ={
        id: this.user.id,
        email: this.Email,
        username: this.user.username,
        firstName: this.FirstName,
        lastName: this.LastName,
        password: '',
        isEmailVerified: true
      }
      let newSkills: Skill[]=[];
      for (const skill of this.skillData.value.skillValue) {
        if (skill.id === '') {
          newSkills.push(skill);
        }
      }

      for (const newSkill of newSkills) {
        let skill: Skill ={
          id: '',
          skillName: newSkill['skillname'],
          skillLevel: newSkill['skilllevel'],
          userId: this.user.id
        }

        console.log("adding skill")
        console.log(await this.skillsService.createSkill(skill).toPromise());
      }

      console.log(this.skills);
      console.log(this.skillData.value.skillValue);

      let updatedSkills: Skill[] = [];

      for (const skill of this.skillData.value.skillValue) {
        if (skill.id != '') {
          updatedSkills.push(skill);
        }
      }
// Code to handle updated skills
      for (const updatedSkill of updatedSkills) {
        let skill: Skill ={
          id: updatedSkill['id'],
          skillName: updatedSkill['skillname'],
          skillLevel: updatedSkill['skilllevel'],
          userId: this.user.id
        }
        console.log("editing skill")
        console.log(await this.skillsService.editSkill(skill).toPromise());
      }



      let usr= this.userservice.updateUser(kuser).subscribe();
      console.log(usr);
      let tezs = await this.userDataService.updateAdditionalUserData(this.userData).toPromise();
      console.log(tezs);
      console.log('Data Modified successfully.');
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
