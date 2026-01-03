import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

export interface ConfirmDialogData {
  title: string;
  message: string;
  mainButtonText?: string;
  secondaryButtonText?: string;
}

@Component({
  selector: 'app-project-name-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  protected readonly data: ConfirmDialogData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onSubmit(): void {
    this.dialogRef.close(true);
  }
}
