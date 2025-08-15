import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {LoginService} from '../service/login/login-service';
import {catchError, map, of} from 'rxjs';
import {UserService} from '../service/user/user-service';


export const AuthGuardAdmin: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const userService = inject(UserService);
  const router = inject(Router);

  if (!localStorage.getItem('token')) {
    router.navigate(['/login']);
    return false;
  }

  if (!loginService.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  return userService.getUserInformation().pipe(
    map(response => {
      const user = response.data;

      if (user?.roles[0] === 'ROLE_ADMIN') {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(err => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
