import {Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {SettingsService, Themes} from '../../../../services/settings-service/settings.service';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {AuthService} from '../../../../services/auth-service/auth.service';
import {
  TimezoneSelectorComponent
} from '../../../../components/timezone-selector/timezone-selector.component';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserService} from '../../../../services/user-service/user.service';

@Component({
  selector: 'personalization-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    TimezoneSelectorComponent,
    NgSelectComponent,
    NgOptionComponent
  ],
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss'
})
export class PersonalizationComponent {
  private settingService = inject(SettingsService);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  protected timezoneControl = new FormControl<string>('');
  protected themeControl = new FormControl<Themes>(Themes.LIGHT);
  protected themes = Object.values(Themes);

  constructor() {
    this.settingService.userSettings$
      .pipe(takeUntilDestroyed())
      .subscribe((settings) => {
        if (settings?.theme) {
          this.themeControl.setValue(settings.theme, { emitEvent: false });
        }
      });

    this.themeControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        switchMap(async (theme) => {
            const userId = this.userService.userId;
            if (userId && theme) {
              await this.settingService.updateSettings(userId, {theme});
            }
            return of(null);
          }
        )
      )
      .subscribe({
        error: (err) => {
          this.notificationService.showError('Failed to update theme', err);
        }
      });
  }
}
