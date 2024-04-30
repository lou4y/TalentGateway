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

  constructor(public dialog: MatDialog,private fb: UntypedFormBuilder,private fbl: FormBuilder,private fileService: FileService) {
    this.skillData = this.fb.group({
      skillValue: this.fb.array([]),
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


  showData() {
    console.log("Image: :" + this.Image);
    console.log("Selected Gender:", this.selectedGender);
    console.log("Birthdate: ", this.Birthdate);
    console.log("Address: :" + this.Address);
    console.log("City: :" + this.City);
    console.log("State :"+ this.State)
    console.log("phone number "+ this.phoneNumber);
    console.log("Description: "+ this.description);
    console.log(this.skillData.value)
    console.log("PDF File: ", this.PDFfile);


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
    try {
      let imageUrl = this.Image; // Assuming this.Image contains the URL of the image

      // Check if this.Image is a base64 string, if so, upload it to Firebase Storage
      if (imageUrl.startsWith('data:image')) {
        // Convert the base64 string to a Blob
        const imageBlob = this.dataURItoBlob(imageUrl);

        // Upload the Blob to Firebase Storage
        imageUrl = await this.fileService.uploadImageBlob(imageBlob);
      }

      const pdfUrl = await this.fileService.uploadPDF(this.PDFfile); // Replace this with your PDF file property

      await this.fileService.saveFileMetadataToFirestore(imageUrl, pdfUrl);

      const userData: AdditionalUserData = {
        userId: 'user_id_here',
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

      // Now, you can send this userData object to your API to save in the database
      // Example: this.apiService.saveUserData(userData);

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
