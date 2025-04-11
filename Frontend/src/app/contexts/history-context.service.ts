import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HistoryItem {
  id: string;
  message: string;
  collection?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryContextService {
  private historySubject = new BehaviorSubject<HistoryItem[]>([]);
  history$: Observable<HistoryItem[]> = this.historySubject.asObservable();

  private filteredHistorySubject = new BehaviorSubject<HistoryItem[]>([]);
  filteredHistory$: Observable<HistoryItem[]> = this.filteredHistorySubject.asObservable();

  addItem(message: string, collection?: string): void {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      message,
      collection,
      timestamp: new Date(),
    };
    const currentHistory = this.historySubject.value;
    this.historySubject.next([...currentHistory, newItem]);
    this.applyFilters();
  }

  clearHistory(): void {
    this.historySubject.next([]);
    this.filteredHistorySubject.next([]);
  }

  getHistory(): HistoryItem[] {
    return this.historySubject.value;
  }

  filterByDate(date: Date | null): void {
    this.applyFilters(date, this.getCurrentCollectionFilter());
  }

  filterByCollection(collection: string | null): void {
    this.applyFilters(this.getCurrentDateFilter(), collection);
  }

  private applyFilters(date: Date | null = this.getCurrentDateFilter(), collection: string | null = this.getCurrentCollectionFilter()): void {
    let filtered = this.historySubject.value;
    if (date) {
      filtered = filtered.filter((item) =>
        item.timestamp.toDateString() === date.toDateString()
      );
    }
    if (collection) {
      filtered = filtered.filter((item) => item.collection === collection);
    }
    this.filteredHistorySubject.next(filtered);
  }

  private getCurrentDateFilter(): Date | null {
    return this.filteredHistorySubject.value.length > 0
      ? this.filteredHistorySubject.value[0].timestamp
      : null;
  }

  private getCurrentCollectionFilter(): string | null {
    return this.filteredHistorySubject.value.length > 0
      ? this.filteredHistorySubject.value[0].collection || null
      : null;
  }
}
