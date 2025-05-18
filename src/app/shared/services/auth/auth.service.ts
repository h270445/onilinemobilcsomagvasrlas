import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  currentUser$: Observable<User | null> = user(this.auth);

  constructor() {
    this.currentUser$.subscribe(user => {
      console.log('Auth state changed:', user);
    });
  }

  async signInWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log("Signed out successfully!");
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    }
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  getCurrentUserStream(): Observable<User | null> {
    return this.currentUser$;
  }
}