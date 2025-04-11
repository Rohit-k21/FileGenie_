import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UseMobileService {
  private readonly MOBILE_BREAKPOINT = 768;
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkMobile());
  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor() {
    const mql = window.matchMedia(`(max-width: ${this.MOBILE_BREAKPOINT - 1}px)`);
    fromEvent(mql, 'change')
      .pipe(debounceTime(200))
      .subscribe(() => this.updateMobileStatus());
    this.updateMobileStatus(); // Initial check
  }

  private checkMobile(): boolean {
    return window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  private updateMobileStatus(): void {
    this.isMobileSubject.next(this.checkMobile());
  }

  // Synchronous getter if needed
  isMobile(): boolean {
    return this.checkMobile();
  }
}
