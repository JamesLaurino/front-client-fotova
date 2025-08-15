import {inject, Injectable, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ClientResponseApi} from '../../model/client/client-response-api';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OrderApiResponse} from '../../model/order/order-api-response';
import {ClientAddress} from '../../model/client/client-address';
import {CommentClientResponseApi} from '../../model/comment/comment-client-response-api';
import {Client} from '../../model/client/client';
import {ClientComment} from '../../model/client/client-comment';

@Injectable({providedIn: 'root'})
export class UserService
{

  readonly #BASE_API_URL = environment.baseUrl;
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  public client = signal<Client>({
    "id":0,
    "username":"test",
    "email":"uh",
    "isActive":true,
    "address":{
      "id":0,
      "street":"0",
      "city":"0",
      "number":0,
      "country":"0",
    },
    "roles":[],
    "comments":[]
  });

  getOrdersByEmail(email: string): Observable<OrderApiResponse> {
    return this.#http.get<OrderApiResponse>(this.#API_URL + '/order-products/' + email);
  }

  addAddressToUser(address:Omit<ClientAddress, 'id'>) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.post<ClientResponseApi>(this.#API_URL + '/client/address', address,{ headers });
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

  addUserComment(commentUser:CommentClient):Observable<CommentClientResponseApi> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.post<CommentClientResponseApi>(this.#API_URL + '/client/comment', commentUser,{ headers });
  }
}
