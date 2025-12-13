import {Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-warning-banner',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './warning-banner.component.html',
  styleUrl: './warning-banner.component.scss'
})
export class WarningBannerComponent {
  public message = input.required<string>();
  public icon = input<string>('warning');
}

