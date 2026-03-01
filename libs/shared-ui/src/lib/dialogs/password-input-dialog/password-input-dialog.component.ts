import { Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgModel } from '@angular/forms';

export interface PasswordDialogData {
  title?: string;
  message?: string;
}

const MIN_PASSWORD_LENGTH = 6;

@Component({
  selector: 'app-password-input-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './password-input-dialog.component.html',
  styleUrl: './password-input-dialog.component.scss',
})
export class PasswordInputDialogComponent {
  @ViewChild('passwordInput') passwordInput!: NgModel;

  returnString = '';

  private dialogRef = inject(MatDialogRef<PasswordInputDialogComponent>);
  protected readonly data: PasswordDialogData = inject<PasswordDialogData>(MAT_DIALOG_DATA);

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSubmit(): void {
    if (this.isPasswordValid()) {
      this.dialogRef.close(this.returnString);
    }
  }

  protected isPasswordValid(): boolean {
    const password = this.returnString || '';
    const hasNoSpaces = !/\s/.test(password);
    return password.length >= MIN_PASSWORD_LENGTH && hasNoSpaces;
  }
}
