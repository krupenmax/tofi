import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from "@angular/platform-browser/animations";
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";

if (environment.production) {
  enableProdMode();
}

const firebaseConfig = {
  apiKey: "AIzaSyBUtNcZ72dL5d5DYFJfmaR5s4kbkfzkUX4",
  authDomain: "tofi-payment-system.firebaseapp.com",
  projectId: "tofi-payment-system",
  storageBucket: "tofi-payment-system.appspot.com",
  messagingSenderId: "464474518142",
  appId: "1:464474518142:web:3efb03170bba3112805e2f",
  measurementId: "G-F2YBQ7L69G"
};

const app = firebase.initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, {
	providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom([
      provideFirebaseApp(() => app),
      provideStorage(() => getStorage(app)),
      provideFirestore(() => getFirestore())
    ])
  ],
});
