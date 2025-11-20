import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-danger-zone',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './danger-zone.component.html',
  styleUrl: './danger-zone.component.scss'
})
export class DangerZoneComponent {

}
