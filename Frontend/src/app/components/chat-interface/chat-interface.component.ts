import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HistoryContextService } from '../../contexts/history-context.service';
import {CollectionService} from '../../services/collection.service';
import {ChatService} from '../../services/chat.service'

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  loading?: boolean;
}

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent implements AfterViewChecked {
  collections: string[] = [];
  selectedCollection: string | null = null;
  messages: Message[] = [];
  isProcessing: boolean = false;
  isHistorySidebarOpen: boolean = false;

  @ViewChild('messagesEndRef') messagesEndRef!: ElementRef<HTMLDivElement>;

  constructor(private historyService: HistoryContextService, private collectionService: CollectionService, private chatService: ChatService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.fetchCollections();
  }

  fetchCollections(): void {
    this.collectionService.getCollections().subscribe({
      next: (collections) => {
        this.collections = collections;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
      }
    });
  }

  handleUploadComplete(fileName: string): void {
    const collectionName = fileName.replace('.pdf', '');
    this.selectedCollection = collectionName;
    this.fetchCollections();
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
      this.showToast('destructive', 'No collection selected', 'Please select a document collection first.');
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

  this.chatService.sendMessage(this.selectedCollection, content).subscribe({
    next: (response) => {
      console.log(response)
      const assistantMessage: Message = {
        id: loadingMessageId,
        content: response.model_response.output,
        role: 'assistant',
        timestamp: new Date(),
      };
      this.messages = this.messages.map((msg) =>
        msg.id === loadingMessageId ? assistantMessage : msg
      );
    },
    error: () => {
      this.showToast('destructive', 'Error', 'Failed to get a response. Please try again.');
      this.messages = this.messages.filter((msg) => msg.id !== loadingMessageId);
    },
    complete: () => {
      this.isProcessing = false;
    },
  });
  }

  handleCollectionChange(selectedCollection: any) {
    console.log("Selected Collection:", selectedCollection);
  }

  toggleHistorySidebar(): void {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  private scrollToBottom(): void {
    this.messagesEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private showToast(variant: 'default' | 'destructive', title: string, description: string): void {
    console.log(`Toast: ${variant} - ${title}: ${description}`);
    // Replace with actual toast service when implemented
  }
}
