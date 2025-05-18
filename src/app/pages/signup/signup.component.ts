import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Auth, createUserWithEmailAndPassword, AuthError } from '@angular/fire/auth';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  private auth: Auth = inject(Auth);

  private router: Router = inject(Router);

  constructor() { }

  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      console.log('Sign up successful!', userCredential.user);

      
      this.router.navigate(['/home']);

    } catch (error: any) { 
      console.error('Sign up error:', error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'The email address is already in use by another account.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'The email address is not valid.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage = 'Email/password accounts are not enabled. Enable Email/password in the Firebase console.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'The password is too weak. Please choose a stronger password.';
          break;
        default:
          this.errorMessage = 'An error occurred during sign up. Please try again.';
      }
    }
  }
}
