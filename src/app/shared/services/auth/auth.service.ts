import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Correctly injecting Auth using Angular's inject function
  private auth: Auth = inject(Auth);

  // Correctly using AngularFire's user() function to get the auth state observable
  // This observable emits the current user or null whenever the auth state changes.
  currentUser$: Observable<User | null> = user(this.auth);

  async signInWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      // Use the injected auth instance
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("Login successful!", userCredential.user); // Log user details on success
      // You could return the userCredential or user object if needed by the component
      // return userCredential.user;
    } catch (error: any) {
      console.error("Login error:", error); // Log the full error object for details
      // Throw the error so components can catch it and display user-friendly messages
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Use the injected auth instance
      await signOut(this.auth);
      console.log("Signed out successfully!");
    } catch (error: any) {
      console.error("Logout error:", error); // Log the full error object for details
      // Throw the error so components can catch it
      throw error;
    }
  }

  // Provides a synchronous check for the current user ID (may be null immediately after logout,
  // or before the initial auth state is resolved on app startup).
  // Note: This does NOT react to auth state changes. Use currentUser$ for reactivity.
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Provides the reactive stream of the current user.
  // This is the preferred way for components to get the user state and react to changes.
  // Components should subscribe to this or use the async pipe in templates.
  getCurrentUserStream(): Observable<User | null> {
    return this.currentUser$;
  }

  // *** IMPORTANT FOR SIGNUP ***
  // You likely need a method for creating a new user with email and password
  // for your signup component to call.
  
  async createUserWithEmailPassword(email: string, password: string): Promise<void> { // Or return UserCredential/User
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("User created successfully!", userCredential.user);
    } catch (error: any) {
       console.error("Signup error:", error); // Log the full error object
       // Throw the error so your signup component can catch and display user-friendly messages
       throw error;
    }
  }
  
}
