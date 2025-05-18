import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

import { Auth, signInWithEmailAndPassword, AuthError } from '@angular/fire/auth';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login', 
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  email: string = ''; 
  password: string = '';
  errorMessage: string | null = null;

  private auth: Auth = inject(Auth);

  private router: Router = inject(Router);

  constructor() { }

  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);

      console.log('Login successful!', userCredential.user);

      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Login error:', error);

      // See Firebase Auth error codes: https://firebase.google.com/docs/auth/admin/errors
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email format.';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'This user account has been disabled.';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-credential':
           this.errorMessage = 'Invalid email or password.';
           break;
        default:
          this.errorMessage = 'An error occurred during login. Please try again.';
      }
    }
  }
}
