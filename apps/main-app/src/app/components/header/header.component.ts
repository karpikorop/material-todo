import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {signal} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {IS_MOBILE} from '../../tokens';
import {inject} from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterLink,
    MatListModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      // State when the menu is closed
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
          paddingTop: '0',
          paddingBottom: '0',
        })
      ),
      // State when the menu is open
      state(
        'open',
        style({
          height: '*', // Animate to the element's natural height
          opacity: 1,
          paddingTop: '*',
          paddingBottom: '*',
        })
      ),
      // Define the transition between states
      transition('closed <=> open', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class HeaderComponent {
  protected showDropdown = signal<boolean>(false);
  protected menu_icon = signal<'menu' | 'close'>('menu');
  protected isMobileView = inject(IS_MOBILE);

  constructor() {
  }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
    if (this.showDropdown()) {
      this.menu_icon.set('close');
    } else {
      this.menu_icon.set('menu');
    }
  }
}
