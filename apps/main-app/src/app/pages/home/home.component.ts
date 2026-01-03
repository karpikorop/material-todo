import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('features') featuresSection!: ElementRef;
  private notificationService = inject(NotificationService);

  scrollToFeatures(): void {
    if (this.featuresSection && this.featuresSection.nativeElement) {
      this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.notificationService.showError('Features section not found!');
    }
  }
}
