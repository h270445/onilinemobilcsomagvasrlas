import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlr_7F5-3p_cSLL2M0zYYWA_js5X7rXMo",
  authDomain: "onlinemobilcsomagvasarlas.firebaseapp.com",
  projectId: "onlinemobilcsomagvasarlas",
  storageBucket: "onlinemobilcsomagvasarlas.firebasestorage.app",
  messagingSenderId: "247448691241",
  appId: "1:247448691241:web:2ff71e99eb13cb93df7238"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()), // Provide Auth here
    provideFirestore(() => getFirestore()) // Provide Firestore here
  ]
};