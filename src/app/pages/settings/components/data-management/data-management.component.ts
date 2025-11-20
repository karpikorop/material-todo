import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDivider
  ],
  templateUrl: './data-management.component.html',
  styleUrl: './data-management.component.scss'
})
export class DataManagementComponent {

}
