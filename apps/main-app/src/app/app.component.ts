import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService, IS_EMULATOR } from 'core-data-access';
import { MatIconRegistry } from '@angular/material/icon';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { UserService } from 'auth-data-access';
import { NotificationService } from 'core-data-access';
import { ThemeService } from 'core-data-access';
import { DataHealService } from 'core-data-access';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private iconService: IconService = inject(IconService);
  private matIconReg: MatIconRegistry = inject(MatIconRegistry);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService); // Ensure userService constructor is called
  private themeService = inject(ThemeService); // Ensure themeService constructor is called
  private dataHealService = inject(DataHealService); // Ensure dataHealService constructor is called
  private isEmulator = inject(IS_EMULATOR);

  constructor() {
    this.iconService.registerIcons();
  }

  ngOnInit(): void {
    this.registerMaterialIcons();
    this.isEmulatorCheck();
  }

  private isEmulatorCheck() {
    if (this.isEmulator) {
      console.warn('Running in emulator mode. Some features may not work as expected.');
      this.notificationService.show({
        title: 'Emulator Mode',
        message:
          'You are running the app in emulator mode. Some features may not work as expected.',
        type: 'warning',
        duration: 10000,
      });
    }
  }

  private registerMaterialIcons() {
    try {
      this.matIconReg.setDefaultFontSetClass('material-symbols-rounded');
    } catch (error) {
      console.error('Failed to set default font set class:', error);
    }
  }
}
// todo setup Module Boundaries for nx
