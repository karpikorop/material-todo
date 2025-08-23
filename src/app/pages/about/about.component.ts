import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {IconsNames} from '../../services/icon-service/icon.service';

@Component({
  selector: 'app-about',
  imports: [MatIconModule, MatCardModule, RouterLink, MatButtonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
}
