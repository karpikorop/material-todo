import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { SettingsComponent } from './pages/settings/settings.component';

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
