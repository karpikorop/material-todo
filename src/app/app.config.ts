import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IS_MOBILE} from './services/layout-service/layout.tokens';
import {LayoutService} from './services/layout-service/layout.service';
import {getFunctions, provideFunctions} from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideFunctions(() => getFunctions()),
    {
      provide: IS_MOBILE,
      useFactory: (layoutService: LayoutService) => layoutService.isMobileView,
      deps: [LayoutService],
    },
  ],
};
