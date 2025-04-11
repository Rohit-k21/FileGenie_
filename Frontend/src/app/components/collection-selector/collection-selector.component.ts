// src/app/collection-selector/collection-selector.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../services/auth.service';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-collection-selector',
  templateUrl: './collection-selector.component.html',
  styleUrls: ['./collection-selector.component.css'],
})
export class CollectionSelectorComponent {
  @Input() selectedCollection: string | null = null;
  @Output() select = new EventEmitter<string>();

  collections: string[] = [];
  error: string | null = null;

  constructor(private collectionService: CollectionService, private authService: AuthService) {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.loadCollections();
      } else {
        this.collections = [];
        this.error = 'Please log in to view collections.';
      }
    });
  }

  get dropdownOptions(): DropdownOption[] {
    return this.collections.map((c) => ({ label: c, value: c }));
  }

  // Load collections from the backend
  private loadCollections(): void {
    this.collectionService.getCollections().subscribe({
      next: (collections) => {
        this.collections = collections;
        this.error = null;
        if (this.collections.length > 0 && !this.selectedCollection) {
          this.selectedCollection = this.collections[0]; // Default to first collection
          this.select.emit(this.selectedCollection);
          this.setCollection(this.selectedCollection);
        }
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
        this.collections = [];
        this.error = 'Failed to load collections. Please try again.';
      },
    });
  }

  // Handle dropdown change
  onCollectionChange(collection: string): void {
    this.select.emit(collection);
    this.setCollection(collection);
  }

  // Set the selected collection on the backend
  private setCollection(collection: string): void {
    this.collectionService.setCollection(collection).subscribe({
      next: (response) => {
        console.log(`Collection set to: ${response.collection_name}`);
      },
      error: (err) => {
        console.error('Error setting collection:', err);
      },
    });
  }
}