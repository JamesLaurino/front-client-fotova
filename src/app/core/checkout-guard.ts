import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../service/user/user-service';
import {map} from 'rxjs';

export const CheckoutGuard: CanActivateFn = () => {
  const userService = inject(UserService);

  return userService.getUserInformation().pipe(
    map(user => {
      console.log(user);
      return user.data.ClientAddressDto !== null;
    })
  );
};
