// src/app/app.routes.ts

import { Routes } from '@angular/router';
import {
    AuthGuard,
    redirectLoggedInTo,
    redirectUnauthorizedTo
} from '@angular/fire/auth-guard';

// --- Import services needed by the home route ---
import { SubscriptionService } from './shared/services/subscription.service';
import { PlanService } from './shared/services/plan.service';
import { AuthService } from './shared/services/auth/auth.service';

// Remove imports for Firestore, Auth, provideFirebaseApp, initializeApp etc. if only used for route providers


// --- Define our redirect pipes ---
const redirectLoggedInToHome = () => redirectLoggedInTo(['/home']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

// --- Define our Routes ---

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
     // Assuming you have a signup page
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'home', // The path users go to after login
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        // --- Provide ONLY your custom services at the ROUTE LEVEL ---
        // Rely on providedIn: 'root' and app.config.ts for Firebase services
        providers: [
          SubscriptionService,
          PlanService,
          AuthService
          // Do NOT list Firestore or Auth here
        ]
        // ------------------------------------------------------
    },
    {
        path: 'profile', // Protected profile page
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
        // Add providers here if specific to profile, but NOT Firestore/Auth if provided in root
        // providers: [ /* Services specific to profile route */ ]
    },
    {
        path: 'subscriptions', // Protected subscriptions list page
        loadComponent: () => import('./pages/subsciptions/subsciptions.component').then(m => m.SubsciptionsComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
        // Add providers here if specific to subscriptions, but NOT Firestore/Auth if provided in root
        // providers: [ /* Services specific to subscriptions route */ ]
    },
    { path: '**', redirectTo: 'home' }
];
