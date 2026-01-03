import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Component, signal, output } from '@angular/core';
import { getTimeZonesList, findTimeZone } from '@shared/lib/utils/timezones.utils';
import { TimeZone } from '@vvo/tzdb';

export interface SelectorOption<T = any> {
  label: string;
  value: T;
}

@Component({
  selector: 'timezone-selector',
  standalone: true,
  templateUrl: './timezone-selector.component.html',
  styleUrl: './timezone-selector.component.scss',
  imports: [NgSelectComponent, FormsModule, NgOptionComponent],
})
export class TimezoneSelectorComponent {
  protected readonly timezoneOptions: SelectorOption<string>[] = this.getTimezoneOptions();

  public selectedTimezone = signal<string>('UTC');

  public selectedTimezoneObject = signal<TimeZone | undefined>(undefined);

  public selectedTimezoneChange = output<string>();

  constructor() {
    this.findMatchingTimeZone();
  }

  protected onSelectedTimezoneChange(value: string): void {
    this.selectedTimezone.set(value);
    this.selectedTimezoneChange.emit(value);
  }

  private findMatchingTimeZone(): void {
    const tz = findTimeZone(this.selectedTimezone());
    this.selectedTimezoneObject.set(tz);
  }

  private getTimezoneOptions(): SelectorOption<string>[] {
    const timezones = getTimeZonesList();
    return timezones.map((tz) => ({
      label: this.getTimezoneDisplay(tz),
      value: tz.name,
    }));
  }

  private getTimezoneDisplay(tz: TimeZone): string {
    const offset = tz.rawFormat.split(' ')[0];
    if (tz.mainCities[0]) {
      return `(${offset}) ${tz.alternativeName} - ${tz.mainCities[0]}`;
    }
    return `(${offset}) ${tz.alternativeName}`;
  }
}
