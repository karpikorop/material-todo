import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { AVAILABLE_LIST_ICONS } from '@shared/lib/models/icons';

export interface AddProjectDialogData {
  editMode?: boolean;
  currentState?: AddProjectDialogState;
}

export interface AddProjectDialogState {
  name: string;
  icon_name: string;
}

@Component({
  selector: 'app-add-project-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    MatTooltip,
  ],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.scss',
})
export class AddProjectDialogComponent {
  protected readonly availableIcons = AVAILABLE_LIST_ICONS;
  projectName = '';
  selectedIcon = 'folder';

  private dialogRef = inject(MatDialogRef<AddProjectDialogComponent>);
  protected readonly data: AddProjectDialogData = inject<AddProjectDialogData>(MAT_DIALOG_DATA);

  constructor() {
    if (this.data.editMode && this.data.currentState) {
      this.projectName = this.data.currentState.name;
      this.selectedIcon = this.data.currentState.icon_name;
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSubmit(): void {
    if (this.projectName?.trim()) {
      const result: AddProjectDialogState = {
        name: this.projectName.trim(),
        icon_name: this.selectedIcon,
      };
      this.dialogRef.close(result);
    }
  }

  protected selectIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  protected get mainButtonLabel(): string {
    return this.data.editMode ? 'Save' : 'Add';
  }

  protected get dialogTitle(): string {
    return this.data.editMode ? 'Edit Project' : 'Add New Project';
  }
}
