import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';

interface InputDialogData {
  title: string,
  message: string,
  placeholder: string,
  mainButtonText: string,
  maxLength: number;
}

@Component({
  selector: 'app-project-name-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './string-input-dialog.component.html',
  styleUrl: './string-input-dialog.component.scss'
})
export class StringInputDialogComponent {
  returnString = '';

  private dialogRef = inject(MatDialogRef<StringInputDialogComponent>);
  protected readonly data: InputDialogData = inject<InputDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.returnString?.trim()) {
      this.dialogRef.close(this.returnString.trim());
    }
  }
}
