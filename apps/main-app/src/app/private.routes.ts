import { Routes } from '@angular/router';
import { AppLayoutComponent } from 'private-layout-feature';
import { TodoListComponent } from 'tasks-feature';
import { SettingsComponent } from 'settings-feature';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'project/inbox',
        pathMatch: 'full',
      },
      {
        path: 'project/:id',
        component: TodoListComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
