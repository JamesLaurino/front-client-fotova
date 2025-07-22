import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {LoginService} from '../service/login/login-service';

export const AuthGuard :CanActivateFn = () => {

  let loginService = inject(LoginService)
  const router = inject(Router);

  if(localStorage.getItem('token') === null) {
    router.navigate(['/login']);
    return false;
  }
  else {
    try {
      if(loginService.isLogged()) {
        return true;
      }
      else {
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

