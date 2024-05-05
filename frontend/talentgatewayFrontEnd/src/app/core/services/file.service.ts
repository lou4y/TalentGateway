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

  uploadImage(image: File): Promise<string> {
    const filePath = `images/${Date.now()}_${image.name}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise<string>((resolve, reject) => {
      this.storage.upload(filePath, image).then(() => {
        fileRef.getDownloadURL().subscribe(downloadURL => {
          resolve(downloadURL);
        }, error => {
          reject(error);
        });
      });
    });
  }

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

  saveFileMetadataToFirestore(imageURL: string, pdfURL: string): Promise<DocumentReference<unknown>> {
    const data = { imageURL, pdfURL };
    return this.firestore.collection('files').add(data);
  }
  async uploadImageBlob(imageBlob: Blob): Promise<string> {
    const filePath = `images/${Date.now()}_${Math.random()}`; // Generating a unique file path
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, imageBlob);

    return new Promise<string>((resolve, reject) => {
      uploadTask.snapshotChanges().subscribe(
        () => {
          fileRef.getDownloadURL().subscribe(
            downloadURL => {
              resolve(downloadURL);
            },
            error => {
              reject(error);
            }
          );
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
