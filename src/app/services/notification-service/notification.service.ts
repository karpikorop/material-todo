import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {inject} from '@angular/core';
import {
  CustomSnackbarComponent,
  CustomSnackbarData,
} from '../../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  public showMessage(message: string) {
    this.showNotification(message);
  }

  public showSuccess(message: string) {
    this.showCustomNotification({title: 'Success', message, type: 'success'});
  }

  public showError(message: string) {
    console.error(message);
    this.showCustomNotification({title: 'Error', message, type: 'error'});
  }

  public showWarning(message: string) {
    console.warn(message);
    this.showCustomNotification({title: 'Warning', message, type: 'warning'});
  }

  public showInfo(message: string) {
    this.showCustomNotification({title: 'Info', message, type: 'info'});
  }

  public show(data: CustomSnackbarData) {
    this.showCustomNotification(data);
  }

  private showCustomNotification(data: CustomSnackbarData) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'info',
      },
      duration: data.duration ?? 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: `${data.type}-snackbar-container`,
    });
  }

  private showNotification(
    message: string,
    action: string = 'Close',
    duration: number = 3000
  ) {
    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
