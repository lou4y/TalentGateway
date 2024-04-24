import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { ChatUser, ChatMessage, ConnectedUser, Chat } from './chat.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {AuthenticationService} from "../../core/services/auth.service";
import { chatData, chatMessagesData } from './data';
import {Router} from "@angular/router";
import {User} from "../../core/models/auth.models";
import {co} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;



  // bread crumb items
  breadCrumbItems: Array<{}>;
  chatData: ChatUser[];
  chatMessagesData: ChatMessage[];
  formData: UntypedFormGroup;
  // Form submit
  chatSubmit: boolean;
  usermessage: string;
  emoji:any = '';

  connectedUser: ConnectedUser[] | undefined | null;
  userChats: any[] = [];
  chatMessages: ChatMessage[];
  chat: { chatId: string, recipientId?: string};
  currentUserId: any ;
  auth: AuthenticationService;

  constructor(public formBuilder: UntypedFormBuilder, private router:Router, private http: HttpClient, private authService: AuthenticationService) {
    this.auth = authService;
  }

  async ngOnInit() {
    this.breadCrumbItems = [{label: 'Skote'}, {label: 'Chat', active: true}];

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    const user: User = await this.auth.currentUser();
    this.onListScroll();
    this._fetchData();
    this.fetchConnectedUser();
    this.fetchUserChats(user.username)


    this.currentUserId = user.username;


    console.log('Current user ID:', this.currentUserId);
  }

  fetchConnectedUser() {
    this.http.get<ConnectedUser[]>('http://localhost:8088/api/connected-users')
      .subscribe(
        (data) => {
          this.connectedUser = data; // Assign fetched data to connectedUser variable
        },
        (error) => {
          console.error('Error fetching connected user:', error);
        }
      );
  }
  fetchChatMessages(chatId: string) {
    this.http.get<ChatMessage[]>(`http://localhost:8088/api/chat-messages/${chatId}`)
      .subscribe(
        (data) => {
          this.chatMessages = data;
        },
        (error) => {
          console.error('Error fetching chat messages:', error);
        }
      );
  }



  fetchUserChats(userId: string) {
    this.http.get<ChatMessage[]>(`http://localhost:8088/api/user-chats/${userId}`)
      .subscribe(
        (data) => {
          // Flatten the chat messages to include both sender and recipient IDs
          const userChats = data.map(chat => ({
            chatId: chat.chatId,
            recipientId: chat.recipientId === userId ? chat.senderId : chat.recipientId
          }));
          // Remove duplicates based on recipientId
          this.userChats = this.removeDuplicates(userChats, 'recipientId');

          // Remove the current user's chats from the list
          this.userChats = this.userChats.filter(chat => chat.recipientId !== userId);
        },
        (error) => {
          console.error('Error fetching user chats:', error);
        }
      );
  }


// Function to remove duplicates from an array of objects based on a specified key
  removeDuplicates(array: any[], key: string) {
    return array.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t[key] === item[key]
        ))
    );
  }



  // Function to handle click on the image icon
  handleImageClick() {
    // Implement your logic here, for example, open a file picker for images
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      console.log('Selected image files:', files);
      // Add your logic to handle the selected image files
    };
    input.click();
  }

  // Function to handle click on the add files icon
  handleAddFilesClick() {
    // Implement your logic here, for example, open a file picker for all files
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      console.log('Selected files:', files);
      // Add your logic to handle the selected files
    };
    input.click();
  }


  openChat(chat: Chat) {
    // Fetch chat messages based on the current user and the recipient
    this.fetchChatMessages(chat.chatId);

    // Fetch user chats based on the current user
    this.fetchUserChats(this.currentUserId);

    // Log the recipientId for debugging purposes
    console.log("recipientId", chat.recipientId);

    // Assign the chat details to the chat variable
    this.chat = { chatId: chat.chatId, recipientId: chat.recipientId };
  }



  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  private _fetchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }



  /**
   * Save the message in chat
   */

  messageSave(recipientId: string) {
    console.log('recipientId:', recipientId);
    const messageContent = this.formData.get('message').value;
    if (messageContent) {
      const messageData = {
        senderId: this.currentUserId,
        recipientId: recipientId, // Use the recipientId passed as a parameter
        content: messageContent,
        timestamp: new Date()
      };

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post<any>('http://localhost:8088/api/send-message', messageData, { headers })
        .toPromise()
        .then(() => {
          console.log('Message sent successfully');
          this.fetchChatMessages(recipientId); // Fetch chat messages with the correct recipient ID
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });

      this.formData.patchValue({ message: '' });
    }
  }




  // Delete Message
  deleteMessage(event: any) {
    event.target.closest('li').remove();
  }

  // Copy Message
  copyMessage(event: any) {
    navigator.clipboard.writeText(event.target.closest('li').querySelector('p').innerHTML);
  }

  // Delete All Message
  deleteAllMessage(event: any) {
    var allMsgDelete: any = document.querySelector('.chat-conversation')?.querySelectorAll('li');
    allMsgDelete.forEach((item: any) => {
      item.remove();
    })
  }

  // Emoji Picker
  showEmojiPicker = false;
  sets: any = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set: any = 'twitter';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {

    const { emoji } = this;
    if (this.formData.get('message').value) {
      var text = `${emoji}${event.emoji.native}`;
    } else {
      text = event.emoji.native;
    }
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

  onBlur() {
  }

  closeReplay() {
    document.querySelector('.replyCard')?.classList.remove('show');
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

  openMeeting(): void {
    // Navigate to the '/meeting' route
    this.router.navigate(['/meeting']);
  }


}
