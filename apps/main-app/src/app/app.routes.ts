import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/singup/signup.component';
import { authGuard } from './core/services/auth-guard/auth.guard';

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
