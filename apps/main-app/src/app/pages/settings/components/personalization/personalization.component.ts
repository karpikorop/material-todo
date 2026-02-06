import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../services/settings-service/settings.service';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { TimezoneSelectorComponent } from '../../../../components/timezone-selector/timezone-selector.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../../../services/user-service/user.service';
import { Themes } from '@shared';

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
  ],
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss',
})
export class PersonalizationComponent {
  private settingService = inject(SettingsService);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  protected themeControl = new FormControl<Themes>(Themes.LIGHT);
  protected themes = Object.values(Themes).map((theme) => this.capitalizeFirstLetter(theme));
  protected currentTimezone = 'UTC';

  constructor() {
    this.settingService.userSettings$.pipe(takeUntilDestroyed()).subscribe((settings) => {
      if (settings?.theme) {
        this.themeControl.setValue(this.capitalizeFirstLetter(settings.theme) as Themes, {
          emitEvent: false,
        });
      }
      if (settings?.timeZone) {
        this.currentTimezone = settings.timeZone;
      }
    });

    this.themeControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        switchMap(async (theme) => {
          const userId = this.userService.userId;
          if (userId && theme) {
            await this.settingService.updateSettings(userId, {
              theme: theme.toLowerCase() as Themes,
            });
          }
          return of(null);
        })
      )
      .subscribe({
        error: (err) => {
          this.notificationService.showError('Failed to update theme', err);
        },
      });
  }

  protected async onTimezoneChange(timezone: string): Promise<void> {
    try {
      const userId = this.userService.userId;
      if (userId && timezone) {
        await this.settingService.updateSettings(userId, {
          timeZone: timezone,
        });
        this.notificationService.showSuccess('Timezone updated successfully');
      }
    } catch (err) {
      this.notificationService.showError('Failed to update timezone', err);
    }
  }

  private capitalizeFirstLetter(inputString: string): string {
    if (!inputString.length) {
      return '';
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }
}
