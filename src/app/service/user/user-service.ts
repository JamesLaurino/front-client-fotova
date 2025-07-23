import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ClientResponseApi} from '../../model/client/client-response-api';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OrderApiResponse} from '../../model/order/order-api-response';
import {ClientAddress} from '../../model/client/client-address';

@Injectable({providedIn: 'root'})
export class UserService
{

  readonly #BASE_API_URL = environment.baseUrl;
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  getOrdersByEmail(email: string): Observable<OrderApiResponse> {
    return this.#http.get<OrderApiResponse>(this.#API_URL + '/order-products/' + email);
  }

  updateAddressInformation(address:Omit<ClientAddress, 'id'>) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.put<ClientResponseApi>(this.#API_URL + '/client/update', address,{ headers });
  }

  getUserInformation():Observable<ClientResponseApi> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.get<ClientResponseApi>(this.#BASE_API_URL + '/api/v1/user', { headers });
  }
}
