import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './info-banner.component.html',
  styleUrl: './info-banner.component.scss',
})
export class InfoBannerComponent {
  public message = input.required<string>();
  public icon = input<string>('info');
}
