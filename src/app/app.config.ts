import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "onlinemobilcsomagvasarlas", appId: "1:247448691241:web:2ff71e99eb13cb93df7238", storageBucket: "onlinemobilcsomagvasarlas.firebasestorage.app", apiKey: "AIzaSyDlr_7F5-3p_cSLL2M0zYYWA_js5X7rXMo", authDomain: "onlinemobilcsomagvasarlas.firebaseapp.com", messagingSenderId: "247448691241" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
