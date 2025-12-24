import {ComponentType} from '@angular/cdk/portal';
import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);

  public async openDialog<D = any, R = any>(
    component: ComponentType<any>,
    data?: D,
    config?: MatDialogConfig<D>
  ): Promise<R> {
    return await firstValueFrom(
      this.dialog.open(component, {
        ...config,
        data: data ?? config?.data,
      }).afterClosed()
    );
  }
}
