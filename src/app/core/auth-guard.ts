import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

export const AuthGuard :CanActivateFn = () => {
  const router = inject(Router);

  console.log("Zuth")
  if(localStorage.getItem('token') === null) {
    router.navigate(['/login']);
    return false;
  }
  else {
    try {
      // const decoded: { exp: number } = jwtDecode(String(localStorage.getItem('token')));
      // const now = Math.floor(Date.now() / 1000);
      // return decoded.exp > now;
      return true;
    } catch (e) {
      return false;
    }
  }
}

