import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { IS_MOBILE } from 'core-data-access';

@Component({
  selector: 'app-app-layout',
  imports: [SidebarComponent, MatSidenavModule, MatIconModule, MatButtonModule, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  protected isMobileView = inject(IS_MOBILE);
  protected sidenavOpen = signal(!this.isMobileView());
}
