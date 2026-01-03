import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './error-banner.component.html',
  styleUrl: './error-banner.component.scss',
})
export class ErrorBannerComponent {
  public message = input.required<string>();
  public icon = input<string>('error');
}
