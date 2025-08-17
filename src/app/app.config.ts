import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IS_MOBILE} from './services/layout-service/layout.tokens';
import {LayoutService} from './services/layout-service/layout.service';

import {getAuth, provideAuth, connectAuthEmulator} from '@angular/fire/auth';
import {getFirestore, provideFirestore, connectFirestoreEmulator} from '@angular/fire/firestore';
import {getFunctions, provideFunctions, connectFunctionsEmulator} from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    
    provideAnimations(),
    provideHttpClient(withFetch()),
    {
      provide: IS_MOBILE,
      useFactory: (layoutService: LayoutService) => layoutService.isMobileView,
      deps: [LayoutService],
    },
  ],
};
