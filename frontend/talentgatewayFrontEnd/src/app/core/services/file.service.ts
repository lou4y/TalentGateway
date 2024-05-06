import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  uploadPDF(pdf: File): Promise<string> {
    const filePath = `pdfs/${Date.now()}_${pdf.name}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise<string>((resolve, reject) => {
      this.storage.upload(filePath, pdf).then(() => {
        fileRef.getDownloadURL().subscribe(downloadURL => {
          resolve(downloadURL);

        }, error => {
          reject(error);
        });
      });
    });
  }
  async uploadImageBlob(imageBlob: Blob): Promise<string> {
    const filePath = `images/${Date.now()}_${Math.random()}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise<string>((resolve, reject) => {
      this.storage.upload(filePath, imageBlob).then(() => {
        fileRef.getDownloadURL().subscribe(downloadURL => {
          resolve(downloadURL);
          console.log(downloadURL);
        }, error => {
          reject(error);
        });
      });
    });
  }
  async getImageFromFirestore(imagePath: string): Promise<string | null> {
    const fileRef = this.storage.refFromURL(imagePath); // Use refFromURL instead of ref

    try {
      const downloadURL = await fileRef.getDownloadURL().toPromise();
      return downloadURL;
    } catch (error) {
      console.error('Error getting image from Firestore:', error);
      return null;
    }
  }
  async getPdfFromFirestore(PDF: string): Promise<File | null> {
    const fileRef = this.storage.refFromURL(PDF); // Use refFromURL instead of ref

    try {
      const downloadURL = await fileRef.getDownloadURL().toPromise();
      return downloadURL;
    } catch (error) {
      console.error('Error getting image from Firestore:', error);
      return null;
    }
  }



}
