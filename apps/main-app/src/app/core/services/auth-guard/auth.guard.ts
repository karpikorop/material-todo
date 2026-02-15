import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    filter((val) => val !== undefined),
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};
