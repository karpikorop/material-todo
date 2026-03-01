import { Routes } from '@angular/router';
import { LoginComponent } from 'auth-feature';
import { SignupComponent } from 'auth-feature';
import { authGuard } from 'auth-data-access';

export const routes: Routes = [
  // --- AUTHENTICATION ROUTES ---
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // --- PROTECTED APP ROUTES ---
  {
    path: 'app',
    canActivate: [authGuard],
    loadChildren: () => import('./private.routes').then((m) => m.PRIVATE_ROUTES),
  },

  // --- PUBLIC ROUTES ---
  {
    path: '',
    loadChildren: () => import('./public.routes').then((m) => m.PUBLIC_ROUTES),
  },

  // --- WILDCARD ROUTE ---
  { path: '**', redirectTo: '' },
];
