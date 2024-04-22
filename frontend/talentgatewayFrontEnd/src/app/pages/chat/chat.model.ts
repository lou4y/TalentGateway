export interface ChatUser {
    image?: string;
    name: string;
    message: string;
    time: string;
    color: string;
}

export interface ChatMessage {
    align?: string;
    name?: string;
    message: string;
    time: string;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  _class: string;
}// connected-user

export interface ConnectedUser {
  nickName: string;
  fullName: string;
  status: string;
}


export interface Chat {
  _id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  _class: string;
  lastMessage: string; // Add this property
}

