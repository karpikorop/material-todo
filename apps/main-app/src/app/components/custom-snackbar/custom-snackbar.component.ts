import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

export interface CustomSnackbarData {
  title?: string;
  message: string;
  duration?: number;
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
  public data: CustomSnackbarData = inject(MAT_SNACK_BAR_DATA);

  private snackBarRef = inject(MatSnackBarRef<CustomSnackbarComponent>);
  
  dismiss() {
    this.snackBarRef.dismiss();
  }
}
