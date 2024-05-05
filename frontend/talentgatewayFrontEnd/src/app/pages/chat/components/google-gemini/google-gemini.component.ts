// google-gemini.component.ts

import { Component, OnInit } from '@angular/core';
import { GeminiService } from './google-gemini.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-google-gemini',
  templateUrl: './google-gemini.component.html',
  styleUrls: ['./google-gemini.component.css']
})
export class GoogleGeminiComponent  implements OnInit {
  receivedText: string='';
  isChatOpen: boolean = true;
  chatHistory: any[] = [];
  prompt:string="";

  constructor(private route:ActivatedRoute, private geminiService: GeminiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.receivedText = params['text'];
    });
    if(this.receivedText!= ''){
      this.prompt=this.receivedText;
    }

    this.geminiService.getMessageHistory().subscribe((res) => {
      if (res) {
        this.chatHistory.push(res);
      }
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (this.prompt.trim() !== '') {
      // Send message to Gemini service
      this.geminiService.generateText(this.prompt);
      // Clear prompt
      this.prompt = '';
    }
  }
}
