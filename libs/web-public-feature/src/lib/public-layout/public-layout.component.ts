import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from 'web-public-ui';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FooterComponent } from 'web-public-ui';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    MatButtonModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    FooterComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {}
