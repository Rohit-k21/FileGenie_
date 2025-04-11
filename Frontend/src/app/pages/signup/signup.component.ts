// src/app/signup/signup.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username: string = ''; // Changed from email to match backend
  password: string = '';
  confirmPassword: string = ''; // Kept for validation, not sent to backend
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = null;

    // Basic client-side validation
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authService.signup(this.username, this.password).subscribe({
      next: () => {
        console.log('Signup successful');
        // Auto-login after signup
        this.authService.login(this.username, this.password).subscribe({
          next: () => this.router.navigate(['/']), // Redirect to home or dashboard
          error: (err) => {
            this.error = err.error?.error || 'Auto-login failed after signup';
            console.error('Auto-login error:', err);
          },
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Signup failed. Please try again.';
        console.error('Signup error:', err);
      },
    });
  }
}