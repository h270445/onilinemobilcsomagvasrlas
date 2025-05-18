import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // Import your component
import { HomeComponent } from './pages/home/home.component'; // Import your home component (example)
import {
    AuthGuard, 
    redirectLoggedInTo,
    redirectUnauthorizedTo
} from '@angular/fire/auth-guard';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'home', // The path users go to after login
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'subscriptions', // The path for available subscriptions
        loadComponent: () => import('./pages/subsciptions/subsciptions.component').then(m => m.SubsciptionsComponent),
        canActivate: [AuthGuard]
    },
    { 
        path: '', redirectTo: '/home', pathMatch: 'full' 
    }
    
    

];
