import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../hooks/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: string = 'system'; // Default value

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }
}
