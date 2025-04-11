import { Component, ElementRef, ViewChild } from '@angular/core';
import { HistoryContextService, HistoryItem } from '../../contexts/history-context.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-comp.component.html',
  styleUrls: ['./dashboard-comp.component.css'],
})
export class DashboardCompComponent {
  collections: string[] = [];
  selectedCollection: string | null = null;
  messages: Message[] = [];
  isProcessing: boolean = false;
  isHistorySidebarOpen: boolean = false;

  @ViewChild('messagesEnd') messagesEndRef!: ElementRef<HTMLDivElement>;

  constructor(public historyService: HistoryContextService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  handleUploadComplete(fileName: string): void {
    const collectionName = fileName.replace('.pdf', '');
    if (!this.collections.includes(collectionName)) {
      this.collections = [...this.collections, collectionName];
    }
    this.selectedCollection = collectionName;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: `<p>I've successfully processed <strong>${fileName}</strong>. You can now ask questions about this document.</p>`,
      role: 'assistant',
      timestamp: new Date(),
    };
    this.messages = [...this.messages, newMessage];
  }

  async handleSendMessage(content: string): Promise<void> {
    if (!this.selectedCollection) {
      alert('No collection selected. Please select a document collection first.');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    this.historyService.addItem(content, this.selectedCollection);

    const loadingMessageId = crypto.randomUUID();
    const loadingMessage: Message = {
      id: loadingMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      loading: true,
    };

    this.messages = [...this.messages, userMessage, loadingMessage];
    this.isProcessing = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      const assistantMessage: Message = {
        id: loadingMessageId,
        content: `<p>This is a simulated response to your question about <strong>${this.selectedCollection}</strong>. In an actual implementation, this would be answered by an AI backend based on the content of your document.</p>`,
        role: 'assistant',
        timestamp: new Date(),
      };
      this.messages = this.messages.map((msg) =>
        msg.id === loadingMessageId ? assistantMessage : msg
      );
    } catch (error) {
      this.messages = this.messages.filter((msg) => msg.id !== loadingMessageId);
      alert('Failed to get a response. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  toggleHistorySidebar(): void {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  private scrollToBottom(): void {
    this.messagesEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  loading?: boolean;
}
