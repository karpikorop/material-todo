import {Component} from '@angular/core';
import {MatTabsModule, MatTabGroup} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [
    MatTabGroup,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDivider,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggle,
    NgOptimizedImage
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
