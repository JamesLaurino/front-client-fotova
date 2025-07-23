import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../service/user/user-service';
import {catchError, map, of} from 'rxjs';
import {ToasterService} from '../service/toaster/toasterService';

export const CheckoutGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toasterService = inject(ToasterService);

  return userService.getUserInformation().pipe(
    map(user => {
      if (user.data.address == null) {
        toasterService.show({
          toastTitle: 'Error',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/error.png',
          toastMessage: 'Une adresse est requise pour effectuer un paiement'
        });
        return false;
      }
      return true;
    }),
    catchError(error => {
      toasterService.show({
        toastTitle: 'Error',
        toastTime: 'il y a 1 min',
        toastImageUrl: '/fotova/error.png',
        toastMessage: 'Une error est survenue'
      });
      return of(router.createUrlTree(['/user']));
    })
  );
};
