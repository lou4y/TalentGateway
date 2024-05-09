import {AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { ChatMessage, Chat } from './chat.model';
import { AuthenticationService } from "../../core/services/auth.service";
import { User,  Kuser } from "../../core/models/auth.models";
import { VideoConferenceUrlService } from "../../chatComponents/video-conference/VideoConferenceUrl.service";
import { SocketService } from './socket.service';
import { KeycloakService } from 'keycloak-angular';
import { GeminiService } from './components/google-gemini/google-gemini.service';
import { S3Service } from './s3.service';
import {FileService} from "../../core/services/file.service";
import {AdditionalUserDataService} from "../../core/services/additional-user-data.service";
import {AdditionalUserData} from "../../core/models/additional-user-data.model";


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
  connectedUser: Kuser[] | undefined | null;
  userChats: any[] = [];
  chatMessages: ChatMessage[] = [];
  chatMessagesSubscription: Subscription;
  chat: { chatId: string, recipientId?: string};
  currentUserId: any;
  auth: AuthenticationService;
  recipientUsername: string;
  showEmojiPicker = false;
  currentUser: User;
  user: User;
  Image: string;
  private userData: AdditionalUserData;
  selectedFileName: string | null = null;
  url: any;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  constructor(public formBuilder: UntypedFormBuilder, private router: Router, private http: HttpClient,
              private authService: AuthenticationService, private conferenceUrlService: VideoConferenceUrlService,
              private socketService: SocketService, private keycloakService: KeycloakService,
              private geminiService: GeminiService, private cdr: ChangeDetectorRef,
               private s3Service: S3Service, private fileService: FileService, private userDataService: AdditionalUserDataService) {
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

    this.socketService.chatMessages$.subscribe(
      (messages) => {
        this.chatMessages = messages;
        this.cdr.detectChanges();
      }
    );

    this.chatMessagesSubscription = this.socketService.chatMessages$.subscribe(
      (messages) => {
        this.chatMessages = messages;
        this.cdr.detectChanges(); // Trigger change detection
      }
    );

    this.user = await this.authService.currentUser();
    this.userData = await this.userDataService.getAdditionalUserData(this.user.id).toPromise()
    this.Image=await this.fileService.getImageFromFirestore(this.userData.profilePicture);
  }




  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }

  fetchConnectedUser() {
    this.http.get<Kuser[]>('http://localhost:8089/keycloak/users')
      .subscribe(
        (data) => {
          this.connectedUser = data;
          console.log('Connected user:', this.connectedUser);},
        (error) => {
          console.error('Error fetching connected user:', error);
        }
      );
  }

  fetchChatMessages(chatId: string) {
    this.socketService.fetchChatMessages(chatId); // Fetch chat messages using SocketService
  }

  fetchUserChats(userId: string) {
    this.http.get<ChatMessage[]>(`http://localhost:8888/MESSAGING-SERVICE/api/user-chats/${userId}`)
      .subscribe(
        (data) => {
          const userChats = data.map(chat => ({
            chatId: chat.chatId,
            recipientId: chat.recipientId === userId ? chat.senderId : chat.recipientId
          }));
          this.userChats = this.removeDuplicates(userChats, 'recipientId');
          this.userChats = this.userChats.filter(chat => chat.recipientId !== userId);
          console.log( this.userChats);
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
    this.chat = { chatId: chat.chatId, recipientId: chat.recipientId };
    this.recipientUsername = chat.recipientId;

    console.log( chat);
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

  sendMeetingUrl(messageData: any): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>('http://localhost:8888/MESSAGING-SERVICE/api/send-message', messageData, { headers })
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


  async createChatWithUser(username: string): Promise<void> {
    try {
      const currentUser = await this.authService.currentUser();
      const senderId = currentUser.username;
      const recipientId = username;
      console.log(username)
      console.log(this.userChats)
      const existingChat: Chat = this.userChats.find(chat => chat.recipientId === recipientId);
      console.log(username)

      if (existingChat) {
        this.openChat(existingChat);
      }else {

        // Adjust the request payload to include the senderId and recipientId as query parameters
        const response = await this.http.post<any>('http://localhost:8888/MESSAGING-SERVICE/api/create-chat', null, {
          params: {senderId, recipientId}
        }).toPromise();

        const chatId = response.data.chatId;

        const newChat: Chat = {_id: null, chatId: null, senderId, recipientId, lastMessage: null, _class: null};
        this.userChats.push(newChat);
        console.log(newChat);
        this.openChat(newChat);


        console.log('Chat created successfully with chat ID:', chatId);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }


  async uploadFile(file: File): Promise<void> {
    try {
      const fileUrl = await this.s3Service.uploadImage(file).toPromise();
      console.log("File uploaded to S3:", fileUrl);
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

  openFile(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('No file URL available.');
    }
  }

  isImage(content: string): boolean {
    if (!content) {
      return false;
    }
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = content.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }


  isFile(content: string): boolean {
    return content && (content.startsWith('http://') || content.startsWith('https://'));
  }

// Method to download the file
  downloadFile(url: string): void {
    window.open(url, '_blank');
  }

  extractFileName(url: string): string {
    const prefix = 'https://msgappfiles.s3.amazonaws.com/';
    if (url.startsWith(prefix)) {
      return url.substring(prefix.length);
    } else {
      return url;
    }
  }

  isFirstMessageOfTheDay(message: ChatMessage, index: number): boolean {
    if (index === 0) {
      return true;
    }
    const currentMessageDate = new Date(message.timestamp);
    const previousMessageDate = new Date(this.chatMessages[index - 1].timestamp);
    return currentMessageDate.toDateString() !== previousMessageDate.toDateString();
  }

}
