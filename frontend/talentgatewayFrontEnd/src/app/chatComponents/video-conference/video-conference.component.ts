import { Component, OnInit } from '@angular/core';


declare const ZegoUIKitPrebuilt: any;

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.onload = () => {
      this.initializeVideoConference();
    };
  }


  initializeVideoConference(): void {
    function getUrlParams(url: string) {
      let urlStr = url.split('?')[1];
      const urlSearchParams = new URLSearchParams(urlStr);
      const result: any = {};
      urlSearchParams.forEach((value, key) => {
        result[key] = value;
      });

      return result;
    }

    const roomID = getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "userName" + userID;
    const appID = 1424078894;
    const serverSecret = "ab640f0aa60b6e99bf852bc645462216";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#root"),
      sharedLinks: [{
        name: 'Personal link',
        url: window.location.protocol + '//' + window.location.host  + window.location.pathname + '?roomID=' + roomID,
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
  }
}

