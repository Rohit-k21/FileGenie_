import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('system');
  theme$: Observable<string> = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.getSystemTheme());
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    const effectiveTheme = theme === 'system' ? this.getSystemTheme() : theme;
    this.themeSubject.next(theme);
    this.applyTheme(effectiveTheme);
  }

  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
