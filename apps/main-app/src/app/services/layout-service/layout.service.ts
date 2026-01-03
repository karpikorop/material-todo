import { Injectable, signal, inject, WritableSignal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public readonly isMobileView: WritableSignal<boolean> = signal(false);

  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobileView.set(result.matches);
    });
  }
}
