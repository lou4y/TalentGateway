import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceUrlService {
  private conferenceUrl: string;

  constructor() { }

  setConferenceUrl(url: string) {
    this.conferenceUrl = url;
  }

  getConferenceUrl(): string {
    return this.conferenceUrl;
  }
}
