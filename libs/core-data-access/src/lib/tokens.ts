import { InjectionToken, Signal } from '@angular/core';

export const IS_MOBILE = new InjectionToken<Signal<boolean>>('isMobile');

export const IS_EMULATOR = new InjectionToken<boolean>('isEmulator');
