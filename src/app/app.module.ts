import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { SubsciptionsComponent } from './pages/subsciptions/subsciptions.component';
import { PlansComponent } from './pages/plans/plans.component';

import { LoginComponent } from './pages/login/login.component';
import { AuthNavbarComponent } from './shared/components/auth-navbar/auth-navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { ToUppercasePipe } from './shared/pipes/touppercase.pipe';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SubsciptionsComponent,
    PlansComponent,
    LoginComponent,
    AuthNavbarComponent,
    ToUppercasePipe,
    AppComponent,
    FormsModule,
    CommonModule,
    HomeComponent
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
})
export class AppModule { }
