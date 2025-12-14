import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {IconService} from './services/icon-service/icon.service';
import {MatIconRegistry} from '@angular/material/icon';
import {OnInit} from '@angular/core';
import {inject} from '@angular/core';
import {UserService} from './services/user-service/user.service';
import {IS_EMULATOR} from './tokens';
import {NotificationService} from './services/notification-service/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private iconService: IconService = inject(IconService);
  private matIconReg: MatIconRegistry = inject(MatIconRegistry);
  private userService = inject(UserService); // Ensure userService constructor is called
  private notificationService = inject(NotificationService);
  private isEmulator = inject(IS_EMULATOR);

  constructor() {
    this.iconService.registerIcons();
  }

  ngOnInit(): void {
    try {
      this.matIconReg.setDefaultFontSetClass('material-symbols-rounded');
    } catch (error) {
      console.error('Failed to set default font set class:', error);
    }
    if (this.isEmulator) {
      console.warn('Running in emulator mode. Some features may not work as expected.');
      this.notificationService.show({
        title: 'Emulator Mode',
        message: 'You are running the app in emulator mode. Some features may not work as expected.',
        type: 'warning',
        duration: 10000,
      })
    }
  }

  title = 'todo-material-angular-app';
}
