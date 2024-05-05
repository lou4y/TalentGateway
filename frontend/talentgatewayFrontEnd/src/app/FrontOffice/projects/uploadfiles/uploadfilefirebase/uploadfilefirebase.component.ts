import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-uploadfilefirebase',
  templateUrl: './uploadfilefirebase.component.html',
  styleUrls: ['./uploadfilefirebase.component.scss']
})
export class UploadfilefirebaseComponent {
  constructor(private fireStorage: AngularFireStorage) { }
  async onFileChange(event:any){
    const file = event.target.files[0];
    if(file){
      const path=`talentgateway/project/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path,file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log(url);
    }

  }

}
