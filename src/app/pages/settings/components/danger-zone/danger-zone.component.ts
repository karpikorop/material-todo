import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'danger-zone-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDivider
  ],
  templateUrl: './danger-zone.component.html',
  styleUrl: './danger-zone.component.scss'
})
export class DangerZoneComponent {

}
