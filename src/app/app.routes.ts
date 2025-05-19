import { Routes } from '@angular/router';
//import { LoginComponent } from './pages/login/login.component';
//import { HomeComponent } from './pages/home/home.component';
//import { ProfileComponent } from './pages/profile/profile.component';
//import { SubsciptionsComponent } from './pages/subsciptions/subsciptions.component';
//import { SignupComponent } from './pages/signup/signup.component'; // <-- Assuming you have a signup component

import {
    AuthGuard,
    redirectLoggedInTo,
    redirectUnauthorizedTo
} from '@angular/fire/auth-guard';


const redirectLoggedInToHome = () => redirectLoggedInTo(['/home']);

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

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
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent), // <-- Update path and component name
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'home', // The path for the main app area
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'subscriptions',
        loadComponent: () => import('./pages/subsciptions/subsciptions.component').then(m => m.SubsciptionsComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'plans',
        loadComponent: () => import('./pages/plans/plans.component').then(m => m.PlansComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    { path: '**', redirectTo: 'login' }
];
