import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CustomSnackbarData {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
})
export class CustomSnackbarComponent {
  // Інжектуємо дані, які були передані з сервісу
  public data: CustomSnackbarData = inject(MAT_SNACK_BAR_DATA);

  // Інжектуємо посилання на сам snackbar, щоб мати можливість його закрити
  private snackBarRef = inject(MatSnackBarRef<CustomSnackbarComponent>);

  // Метод для закриття сповіщення
  dismiss() {
    this.snackBarRef.dismiss();
  }
}
