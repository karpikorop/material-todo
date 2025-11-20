import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatCardModule,
    MatSlideToggle
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

}
