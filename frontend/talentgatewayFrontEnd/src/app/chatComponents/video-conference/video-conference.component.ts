import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../core/services/auth.service";

declare var ZegoUIKitPrebuilt: any;

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

  constructor(private authService: AuthenticationService) { } // Inject the AuthenticationService

  ngOnInit(): void {
    this.setupVideoConference();
  }

  setupVideoConference(): void {
    const roomID = this.getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");

    // Fetch current user ID and username from AuthenticationService
    this.authService.currentUser().then(user => {
      const userID = user.username;
      const userName = user.username;

      const appID = 939715686;
      const serverSecret = "0b03a70933affa672bc6ec71d4de390e";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: document.querySelector("#root"),
        sharedLinks: [{
          name: 'Personal link',
          url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },

        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
      });
    }).catch(error => {
      console.error('Error fetching current user:', error);
    });
  }

  getUrlParams(url: string): any {
    let urlStr = url.split('?')[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    const result = Object.fromEntries(urlSearchParams.entries());
    return result;
  }
}
