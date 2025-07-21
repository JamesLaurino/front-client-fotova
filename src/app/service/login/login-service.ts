import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginApiResponse} from '../../model/login/login-api-response';
import {LoginApiInput} from '../../model/login/login-api-input';
import {isTokenExpired} from '../../helper/jwt-helper';
import {LoginHelper} from '../../helper/login-helper';

@Injectable({providedIn: 'root'})
export class LoginService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);
  readonly #loginHelper = inject(LoginHelper);

  login(loginApiInput:LoginApiInput): Observable<LoginApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.#http.post<LoginApiResponse>(this.#API_URL + '/login', loginApiInput,{ headers });
  }

  isLogged(): boolean {
    const token = localStorage.getItem('token')
    if(token && !isTokenExpired(token)) {
      this.#loginHelper.logged.update((n:boolean) => n = true);
      return true;
    }
    this.#loginHelper.logged.update((n:boolean) => n = false);
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setValueToken(token:string):void {
    localStorage.setItem('token', token);
  }

}
