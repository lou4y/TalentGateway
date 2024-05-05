import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { User } from '../../core/models/auth.models';
import { KeycloakService } from 'keycloak-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from "./chat.model";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private stompClient: Stomp.Client;
  private authToken: string;
  private chatMessagesSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  public chatMessages$: Observable<ChatMessage[]> = this.chatMessagesSubject.asObservable();
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) { }

  public connect(user: User): void {
    const socket = new SockJS('http://localhost:8088/ws');
    this.stompClient = Stomp.over(socket);

    const token = this.keycloakService.getKeycloakInstance().token;

    this.stompClient.connect({ 'Authorization': 'Bearer ' + token }, () => {
      console.log('Connected to WebSocket server');
      this.subscribeToUserQueue(user.username);
    }, (error) => {
      console.error('Could not connect to WebSocket server:', error);
    });
  }

  private subscribeToUserQueue(username: string): void {
    this.stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
      console.log('Message received from user queue:', message);
      this.messageSubject.next(message);
      const chatMessage: ChatMessage = JSON.parse(message.body);
      const currentMessages = this.chatMessagesSubject.value;
      currentMessages.push(chatMessage);
      this.chatMessagesSubject.next(currentMessages);
    });
  }

  public sendMessage(destination: string, message?: any): void {
    if (message) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
    } else {
      this.stompClient.send(destination);
    }
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  public getMessageSubject(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  fetchChatMessages(chatId: string): void {
    // Assuming you have an endpoint to fetch chat messages for a given chatId
    this.http.get<any[]>(`http://localhost:8088/api/chat-messages/${chatId}`)
      .subscribe(
        (data) => {
          console.log('Chat messages fetched successfully:');
          // Emit fetched messages to trigger update in the chat component
          this.chatMessagesSubject.next(data);
        },
        (error) => {
          console.error('Error fetching chat messages:', error);
        }
      );
  }
}
