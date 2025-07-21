import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoginService} from '../service/login/login-service';

export const CheckoutGuard :CanActivateFn = () => {

  let loginService = inject(LoginService)
  const router = inject(Router);

  if(localStorage.getItem('token') === null) {
    router.navigate(['/login']);
    return false;
  }
  else {
    try {
      return loginService.isLogged();
    } catch (e) {
      return false;
    }
  }
}
