import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h1>bot para able</h1>
      </div>
      <div class="chat-wrapper">
        <div class="providers-section">
          <h3>Choose AI:</h3>
          <select [(ngModel)]="selectedProvider" class="provider-select">
            <option value="">Select one</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
            <option value="huggingface">Hugging Face</option>
            <option value="cohere">Cohere</option>
          </select>

          <h3>API Key:</h3>
          <input 
            type="password" 
            [(ngModel)]="apiKey" 
            placeholder="Paste your API key here"
            class="api-key-input"
          >
        </div>

        <div class="messages-container" #messagesDiv>
          <div *ngFor="let msg of messages" [class]="'message ' + msg.role">
            <div class="msg-content">{{ msg.content }}</div>
            <div class="msg-time">{{ msg.timestamp | date:'short' }}</div>
          </div>
        </div>

        <div class="input-section">
          <input 
            type="text" 
            [(ngModel)]="messageInput" 
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            class="message-input"
          >
          <button (click)="sendMessage()" [disabled]="loading" class="send-btn">
            {{ loading ? 'Sending...' : 'Send' }}
          </button>
        </div>

        <div *ngIf="errorMsg" class="error-notification">
          {{ errorMsg }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      min-height: 100vh;
      background: #000000;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      font-family: 'Playfair Display', serif;
    }

    .chat-header {
      background: #000000;
      padding: 20px;
      text-align: center;
      border-bottom: 2px solid #ffffff;
    }

    .chat-header h1 {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .chat-wrapper {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 120px);
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      padding: 20px;
      gap: 20px;
    }

    .providers-section {
      background: #000000;
      padding: 20px;
      border: 2px solid #ffffff;
      border-radius: 0;
    }

    .providers-section h3 {
      margin: 10px 0;
      font-size: 16px;
      text-transform: uppercase;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
    }

    .provider-select, .api-key-input {
      width: 100%;
      padding: 12px;
      margin: 8px 0 15px 0;
      border: 2px solid #ffffff;
      background: #000000;
      color: #ffffff;
      font-size: 14px;
      font-family: 'Playfair Display', serif;
    }

    .api-key-input {
      font-family: monospace;
    }

    .provider-select:focus, .api-key-input:focus {
      outline: none;
      border-color: #ffffff;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: #000000;
      border: 2px solid #ffffff;
    }

    .message {
      display: flex;
      flex-direction: column;
      max-width: 80%;
      padding: 12px;
      border: 2px solid #ffffff;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.6;
    }

    .message.user {
      align-self: flex-end;
      background: #ffffff;
      color: #000000;
    }

    .message.assistant {
      align-self: flex-start;
      background: #000000;
      color: #ffffff;
    }

    .msg-content {
      word-break: break-word;
    }

    .msg-time {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 6px;
    }

    .input-section {
      display: flex;
      gap: 10px;
      padding: 0;
    }

    .message-input {
      flex: 1;
      padding: 12px;
      border: 2px solid #ffffff;
      background: #000000;
      color: #ffffff;
      font-size: 14px;
      font-family: 'Playfair Display', serif;
    }

    .message-input:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .send-btn {
      background: #ffffff;
      color: #000000;
      border: 2px solid #ffffff;
      padding: 12px 30px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      transition: 0.3s;
      font-family: 'Playfair Display', serif;
      letter-spacing: 1px;
    }

    .send-btn:hover:not(:disabled) {
      background: #000000;
      color: #ffffff;
      transform: scale(1.05);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-notification {
      background: #000000;
      color: #ffffff;
      padding: 12px;
      border: 2px solid #ffffff;
      text-align: center;
      font-weight: 700;
      font-size: 14px;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #000000;
    }

    ::-webkit-scrollbar-thumb {
      background: #ffffff;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #cccccc;
    }
  `]
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  messageInput = '';
  selectedProvider = '';
  apiKey = '';
  loading = false;
  errorMsg = '';

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  sendMessage() {
    if (!this.messageInput.trim() || !this.selectedProvider || !this.apiKey) {
      this.errorMsg = 'Fill all fields!';
      return;
    }

    const userMessage = this.messageInput;
    this.messages.push({
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    });

    this.messageInput = '';
    this.loading = true;
    this.errorMsg = '';

    this.chatService.sendMessage(userMessage, this.selectedProvider, this.apiKey).subscribe(
      (res) => {
        this.messages.push({
          content: res.response,
          role: 'assistant',
          timestamp: new Date()
        });
        this.loading = false;
        this.scrollToBottom();
      },
      (err) => {
        this.errorMsg = 'Error: ' + (err.error?.error || 'Something went wrong');
        this.loading = false;
      }
    );
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}
