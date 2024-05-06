import {AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { ChatMessage, Chat } from './chat.model';
import { AuthenticationService } from "../../core/services/auth.service";
import { User } from "../../core/models/auth.models";
import { VideoConferenceUrlService } from "../../chatComponents/video-conference/VideoConferenceUrl.service";
import { SocketService } from './socket.service';
import { KeycloakService } from 'keycloak-angular';
import { GeminiService } from './components/google-gemini/google-gemini.service';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import { S3Service } from './s3.service'; // Import the S3Service


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;

  // Properties
  breadCrumbItems: Array<{}>;
  formData: UntypedFormGroup;
  chatSubmit: boolean;
  emoji: any = '';
  connectedUser: User[] | undefined | null;
  userChats: any[] = [];
  chatMessages: ChatMessage[] = [];
  chatMessagesSubscription: Subscription;
  chat: { chatId: string, recipientId?: string};
  currentUserId: any;
  auth: AuthenticationService;
  recipientUsername: string;
  showEmojiPicker = false;
  currentUser: User;

  selectedFileName: string | null = null;
  url: any;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  constructor(public formBuilder: UntypedFormBuilder, private router: Router, private http: HttpClient,
              private authService: AuthenticationService, private conferenceUrlService: VideoConferenceUrlService,
              private socketService: SocketService, private keycloakService: KeycloakService,
              private geminiService: GeminiService, private cdr: ChangeDetectorRef,
              private fireStorage: AngularFireStorage, private s3Service: S3Service) {
    this.auth = authService;
  }

  async ngOnInit() {
    this.breadCrumbItems = [{label: 'Skote'}, {label: 'Chat', active: true}];
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    const user: User = await this.auth.currentUser();
    this.fetchConnectedUser();
    this.fetchUserChats(user.username);
    this.currentUserId = user.username;

    this.authService.currentUser().then(user => {
      this.currentUser = user;
      this.socketService.connect(this.currentUser);
      console.log('Connected to WebSocket server');

    });

    console.log('Current user ID:', this.currentUserId);

    this.authService.currentUser().then(user => {
      this.currentUser = user;
      this.socketService.connect(this.currentUser);
      console.log('Connected to WebSocket server');
    });

    this.chatMessagesSubscription = this.socketService.chatMessages$.subscribe(
      (messages) => {
        this.chatMessages = messages;
      }
    );

    this.socketService.chatMessages$.subscribe(
      (messages) => {
        this.chatMessages = messages;
        this.cdr.detectChanges(); // Trigger change detection
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription to prevent memory leaks
    this.chatMessagesSubscription.unsubscribe();
  }


  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }

  fetchConnectedUser() {
    this.http.get<User[]>('http://localhost:8089/keycloak/users')
      .subscribe(
        (data) => {
          this.connectedUser = data; },
        (error) => {
          console.error('Error fetching connected user:', error);
        }
      );
  }

  fetchChatMessages(chatId: string) {
    this.socketService.fetchChatMessages(chatId); // Fetch chat messages using SocketService
  }

  fetchUserChats(userId: string) {
    this.http.get<ChatMessage[]>(`http://localhost:8088/api/user-chats/${userId}`)
      .subscribe(
        (data) => {
          const userChats = data.map(chat => ({
            chatId: chat.chatId,
            recipientId: chat.recipientId === userId ? chat.senderId : chat.recipientId
          }));
          this.userChats = this.removeDuplicates(userChats, 'recipientId');
          this.userChats = this.userChats.filter(chat => chat.recipientId !== userId);
        },
        (error) => {
          console.error('Error fetching user chats:', error);
        }
      );
  }

  removeDuplicates(array: any[], key: string) {
    return array.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t[key] === item[key]
        ))
    );
  }
  handleAddFilesClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      console.log('Selected files:', files);
    };
    input.click();
  }

  openChat(chat: Chat) {
    this.fetchChatMessages(chat.chatId);
    this.fetchUserChats(this.currentUserId);
    this.chat = { chatId: chat.chatId, recipientId: chat.recipientId };
    this.recipientUsername = chat.recipientId;
    setTimeout(() => {
      this.scrollChatToBottom();
    }, 100);
  }

  scrollChatToBottom() {
    if (this.scrollRef !== undefined) {
      this.scrollRef.SimpleBar.getScrollElement().scrollTop =
        this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
    }
  }

  get form() {
    return this.formData.controls;
  }

  messageSend(recipientId: string) {
    const messageContent = this.formData.get('message').value;
    if (messageContent) {
      const messageData = {
        senderId: this.currentUserId,
        recipientId: recipientId,
        content: messageContent,
        timestamp: new Date()
      };
      this.socketService.sendMessage(`/app/chat`, messageData);
      this.formData.patchValue({ message: '' });
      this.scrollChatToBottom();
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { emoji } = this;
    if (this.formData.get('message').value) {
      var text = `${emoji}${event.emoji.native}`;
    } else {
      text = event.emoji.native;}
    this.emoji = text;
    this.showEmojiPicker = false;
  }


  // keep
  ContactSearch() {
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-list");
    ul.forEach((item: any) => {
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h5")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    })
  }

  //Meetings
  sendMeetingUrl(messageData: any): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>('http://localhost:8088/api/send-message', messageData, { headers })
      .toPromise()
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }
  openMeeting(recipientId: string): void {
    const videoConferenceUrl = this.conferenceUrlService.getConferenceUrl();
    if (videoConferenceUrl) {
      const messageContent = `Hey, let's meet here: <a href="${videoConferenceUrl}" target="_blank">${videoConferenceUrl}</a>`;
      const messageData = {
        senderId: this.currentUserId,
        recipientId: recipientId,
        content: messageContent,
        timestamp: new Date()
      };
      this.sendMeetingUrl(messageData);
      console.log('Meeting URL sent successfully:', messageContent);
      this.router.navigate(['meeting']);
    } else {
      console.error('Video conference URL not available.');
    }
    this.router.navigate(['meeting']);
  }
  triggerFileInput(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click(); // Triggers the hidden file input
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadFile(file); // Handles the file upload
    }
  }





  async uploadFile(file: File): Promise<void> {
    try {
      const fileUrl = await this.s3Service.uploadImage(file).toPromise();
      console.log("File uploaded to S3:", fileUrl);

      // Assign the file URL to a property for later use
      this.url = fileUrl;
      this.selectedFileName = file.name;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
    }
  }

  fileSend(recipientId: string) {
    if (this.url) {
      const messageData = {
        senderId: this.currentUserId,
        recipientId: recipientId,
        content: this.url,
        timestamp: new Date()
      };
      this.socketService.sendMessage(`/app/chat`, messageData);
      this.formData.patchValue({ message: '' });
      this.scrollChatToBottom();
      this.cdr.detectChanges();
    } else {
      console.error('No file URL available.');
    }
  }



}
