import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification-service/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewChild, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('features') featuresSection!: ElementRef;

  constructor(private notificationService: NotificationService) {}

  scrollToFeatures(): void {
    if (this.featuresSection && this.featuresSection.nativeElement) {
      this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.notificationService.showError('Features section not found!');
    } else {
      this.notificationService.showError('Features section not found!');
    }
  }
}
