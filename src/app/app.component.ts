import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService } from './services/icon-service/icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private iconService: IconService,
    private matIconReg: MatIconRegistry
  ) {
    this.iconService.registerIcons();
  }
  ngOnInit(): void {
    try {
      this.matIconReg.setDefaultFontSetClass('material-symbols-rounded');
    } catch (error) {
      console.error('Failed to set default font set class:', error);
    }
  }

  title = 'todo-material-angular-app';
}
