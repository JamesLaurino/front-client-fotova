import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginApiResponse} from '../../model/login/login-api-response';
import {LoginApiInput} from '../../model/login/login-api-input';

@Injectable({providedIn: 'root'})
export class LoginService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  login(loginApiInput:LoginApiInput): Observable<LoginApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.#http.post<LoginApiResponse>(this.#API_URL + '/login', loginApiInput,{ headers });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setValueToken(token:string):void {
    localStorage.setItem('token', token);
  }

}
