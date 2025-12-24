import {Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {SettingsService} from '../../../../services/settings-service/settings.service';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {
  TimezoneSelectorComponent
} from '../../../../components/timezone-selector/timezone-selector.component';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';

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

  protected timezoneControl = new FormControl<string>('');

  constructor() {

  }
}
