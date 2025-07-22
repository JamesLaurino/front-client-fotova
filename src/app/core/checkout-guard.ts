import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../service/user/user-service';
import {catchError, map, of} from 'rxjs';

export const CheckoutGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUserInformation().pipe(
    map(user => {
      console.log(user)
      return user.data.ClientAddressDto !== null ? true : router.createUrlTree(['/']);
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
