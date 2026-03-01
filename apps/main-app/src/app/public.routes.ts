// src/app/public.routes.ts
import { Routes } from '@angular/router';
import {
  HomeComponent,
  AboutComponent,
  PricingComponent,
  DownloadsComponent,
  PublicLayoutComponent,
} from 'web-public-feature';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'downloads', component: DownloadsComponent },
    ],
  },
];
