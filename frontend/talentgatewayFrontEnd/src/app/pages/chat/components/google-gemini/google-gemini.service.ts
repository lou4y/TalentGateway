import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private generativeAI : GoogleGenerativeAI;
  private messageHistory:BehaviorSubject<any>= new BehaviorSubject(null);
  constructor() {
    this.generativeAI= new GoogleGenerativeAI('AIzaSyB_iRPqfopNIUqJQGKa5RaQbWLH7zD1uGY');
  }
  async generateText(prompt:string){
    const model = this.generativeAI.getGenerativeModel({model:'gemini-pro'});
    const promptWithLanguage = "language: en\n" + prompt; // Prepend language token
    this.messageHistory.next({
      from:'user',
      message:prompt
    })
    const result = await model.generateContent(promptWithLanguage);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    this.messageHistory.next({
      from:'bot',
      message:text
    })

  }
  public getMessageHistory():Observable<any>{
    return this.messageHistory.asObservable();
  }

}
