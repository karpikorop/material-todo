import { InjectionToken, Signal } from '@angular/core';

export const IS_MOBILE = new InjectionToken<Signal<boolean>>('isMobile');
