import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UseMobileService } from '../../hooks/use-mobile.service';
import { HistoryContextService } from '../../contexts/history-context.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() className?: string;

  searchTerm: string = '';
  filteredCollections: string[] = [];
  isDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isHistorySidebarOpen: boolean = false;
  isDark : boolean = true;

  @ViewChild('searchRef') searchRef!: ElementRef<HTMLDivElement>;

  collections: string[] = [
    'Annual Report 2023',
    'Product Specifications',
    'User Manual',
    'Legal Documents',
    'Research Papers',
  ];

  constructor(
    private mobileService: UseMobileService,
    public historyService: HistoryContextService // For sidebar
  ) {}

  ngOnInit(): void {
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobileMenuOpen = isMobile && this.isMobileMenuOpen;
    });
    console.log(this.isDark);


  }

  filterCollections(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredCollections = query
      ? this.collections.filter((collection) => collection.toLowerCase().includes(query))
      : [];
    this.isDropdownOpen = this.filteredCollections.length > 0;
  }

  selectCollection(collection: string): void {
    this.searchTerm = collection;
    this.isDropdownOpen = false;
    this.filteredCollections = [];
  }

  saveSearch(): void {
    if (this.searchTerm) {
      console.log('Saving search:', this.searchTerm);
      // Add logic to save to history or elsewhere if needed
    }
  }

  toggleTheme(): void {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    this.isDark = isDark ? true : false;
    console.log(this.isDark);
    root.classList.toggle('dark', !isDark);
  }

  toggleHistorySidebar(): void {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (this.searchRef && !this.searchRef.nativeElement.contains(event.target as Node)) {
      this.isDropdownOpen = false;
      this.filteredCollections = [];
    }
  }

  toggleDropDown() {
    if(this.isDropdownOpen === false) {
      this.filteredCollections = this.collections;
      this.isDropdownOpen = true;
    }
  }
}
