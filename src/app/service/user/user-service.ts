import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClientResponseApi} from '../../model/client/client-response-api';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UserService
{

  readonly #API_URL = environment.baseUrl;
  readonly #http:HttpClient = inject(HttpClient)

  getUserInformation():Observable<ClientResponseApi> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.get<ClientResponseApi>(this.#API_URL + '/api/v1/user', { headers });
  }
}
