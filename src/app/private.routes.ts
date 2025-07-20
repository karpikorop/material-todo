// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { TodoListComponent } from './pages/todo-list/todo-list.component';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
      { path: 'todos', component: TodoListComponent },
    ],
  },
];
