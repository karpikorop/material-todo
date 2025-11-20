import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-personalization',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss'
})
export class PersonalizationComponent {

}
