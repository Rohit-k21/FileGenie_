import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent {
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'Type your question about the document...';
  @Output() send = new EventEmitter<string>();

  message: string = '';

  handleSend(): void {
    if (this.message.trim() && !this.disabled) {
      this.send.emit(this.message);
      this.message = '';
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }
}
