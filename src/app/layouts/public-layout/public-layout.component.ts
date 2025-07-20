import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    MatButtonModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    MatSidenav,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
}
