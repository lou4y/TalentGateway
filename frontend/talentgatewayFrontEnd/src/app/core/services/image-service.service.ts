import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {
  private _selectedImage: string | null = null;

  get selectedImage(): string | null {
    console.log('Getting selected image:', this._selectedImage);
    return this._selectedImage;
  }

  set selectedImage(value: string | null) {
    console.log('Setting selected image:', value);
    this._selectedImage = value;
  }

  constructor() { }
}
