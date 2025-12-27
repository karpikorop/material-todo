import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {SettingsService, Themes} from '../settings-service/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private settingsService = inject(SettingsService);

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    this.settingsService.userSettings$.subscribe((settings) => {
      if (settings?.theme) {
        this.isDarkMode.set(settings.theme === Themes.DARK);
      }
    });

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const isDark = this.isDarkMode();
        const html = document.documentElement;

        if (isDark) {
          html.classList.add('dark-theme');
          localStorage.setItem('theme', Themes.DARK);
        } else {
          html.classList.remove('dark-theme');
          localStorage.setItem('theme', Themes.LIGHT);
        }
      }
    });
  }

  private initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDarkMode.set(storedTheme === Themes.DARK);
      return;
    }
    this.isDarkMode.set(false);
  }
}
