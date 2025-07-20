import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

//DEFINE ICONS
// This enum defines the names of the icons used in the application.
// Only define SVG icons to register in the icon service.
// The icons should be placed in the public/icons directory.
// The icon names should match the file names without the .svg extension.
export enum IconsNames {
  GitHub = 'github-mark',
  LinkedIn = 'linkedin',
}

// To use an icon in a component, you can use the mat-icon directive with the svgIcon attribute.
// Example: <mat-icon svgIcon="github-mark"></mat-icon>
// This will render the icon from public/icons/github-mark.svg.

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  public registerIcons(): void {
    try {
      this.loadIcons(Object.values(IconsNames), 'icons');
    } catch (error) {
      console.error('Failed to register icons:', error);
    }
  }

  private loadIcons(iconKeys: string[], iconUrl: string): void {
    if (!iconKeys || iconKeys.length === 0) {
      console.warn('No icon keys provided for registration');
      return;
    }

    if (!iconUrl || iconUrl.trim() === '') {
      console.error('Invalid icon URL provided');
      return;
    }
    console.log(`Registering icons from public/${iconUrl}`);

    iconKeys.forEach((key) => {
      try {
        if (!key || key.trim() === '') {
          console.warn('Skipping empty or invalid icon key');
          return;
        }

        console.log(`Registering icon: ${key}`);

        const iconPath = `${iconUrl}/${key}.svg`;
        const sanitizedUrl =
          this.domSanitizer.bypassSecurityTrustResourceUrl(iconPath);

        if (!sanitizedUrl) {
          console.error(`Failed to sanitize URL for icon: ${key}`);
          return;
        }

        this.matIconRegistry.addSvgIcon(key, sanitizedUrl);
      } catch (error) {
        console.error(`Failed to register icon '${key}':`, error);
      }
    });
  }
}
