import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8954';
  private tokenKey = 'auth_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // Check if user is logged in
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Sign up a new user
  signup(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { username, password });
  }

  // Log in and store the token
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ any }>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        localStorage.setItem("id", response.userId )

        this.loggedIn.next(true);
      })
    );
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set the token in localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Check if a token exists
  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Log out
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }
}