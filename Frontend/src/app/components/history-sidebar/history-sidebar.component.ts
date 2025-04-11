import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryContextService, HistoryItem } from '../../contexts/history-context.service';
import { format } from 'date-fns';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-history-sidebar',
  templateUrl: './history-sidebar.component.html',
  styleUrls: ['./history-sidebar.component.css'],
})
export class HistorySidebarComponent {
  @Input() open: boolean = false;
  @Input() collections: string[] = [];
  @Output() close = new EventEmitter<void>();

  date: Date | null = null;
  searchTerm: string = '';
  selectedCollection: string | null = null;

  constructor(public historyService: HistoryContextService) {}

  get filteredBySearch(): HistoryItem[] {
    let filteredHistory = this.historyService.getHistory();
    if (this.searchTerm) {
      filteredHistory = filteredHistory.filter((item) =>
        item.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.date) {
      filteredHistory = filteredHistory.filter((item) =>
        this.isSameDay(item.timestamp, this.date!)
      );
    }
    if (this.selectedCollection) {
      filteredHistory = filteredHistory.filter((item) =>
        item.collection === this.selectedCollection
      );
    }
    return filteredHistory;
  }

  get dropdownOptions(): DropdownOption[] {
    return [
      { label: 'All Collections', value: 'all' },
      ...this.collections.map((c) => ({ label: c, value: c })),
    ];
  }

  handleDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const dateValue = input.value ? new Date(input.value) : null;
    this.date = dateValue;
    this.historyService.filterByDate(this.date);
  }

  handleCollectionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCollection = select.value === 'all' ? null : select.value;
    this.historyService.filterByCollection(this.selectedCollection);
  }

  handleClearHistory(): void {
    this.historyService.clearHistory();
    this.date = null;
    this.searchTerm = '';
    this.selectedCollection = null;
  }

  formatDate(timestamp: Date): string {
    return format(timestamp, 'MMM d, yyyy • h:mm a');
  }

  // Helper to compare dates (day only)
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
