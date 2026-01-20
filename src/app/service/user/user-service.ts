import {inject, Injectable, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {ClientResponseApi} from '../../model/client/client-response-api';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OrderApiResponse} from '../../model/order/order-api-response';
import {ClientAddress} from '../../model/client/client-address';
import {CommentClientResponseApi} from '../../model/comment/comment-client-response-api';
import {Client} from '../../model/client/client';
import {ClientResponseAllApi} from '../../model/client/client-response-all-api';
import {ClientDetailResponseApi} from '../../model/client/ClientDetailResponseApi';
import {ClientEmail} from '../../model/client/client-email';
import {ClientResponseEmailApi} from '../../model/client/client-response-email-api';

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

  sendEmail(clientEmail: ClientEmail): Observable<ClientResponseEmailApi> {
    return this.#http.post<ClientResponseEmailApi>(this.#API_URL + '/amq/contact', clientEmail);
  }

  getClientById(idClient: number): Observable<ClientDetailResponseApi> {
    return this.#http.get<ClientDetailResponseApi>(this.#API_URL + '/client/' + idClient);
  }

  getAllClient(): Observable<ClientResponseAllApi> {
    return this.#http.get<ClientResponseAllApi>(this.#API_URL + '/clients');
  }

  deleteClientById(idClient: number): Observable<ClientResponseApi> {
    return this.#http.delete<ClientResponseApi>(this.#API_URL + '/client/' + idClient + "/delete");
  }

  addAddressToUser(address:Omit<ClientAddress, 'id'>) {
    return this.#http.post<ClientResponseApi>(this.#API_URL + '/client/address', address);
  }

  updateAddressInformation(address:Omit<ClientAddress, 'id'>) {
    return this.#http.put<ClientResponseApi>(this.#API_URL + '/client/update', address);
  }

  getUserInformation():Observable<ClientResponseApi> {
    return this.#http.get<ClientResponseApi>(this.#BASE_API_URL + '/api/v1/user');
  }

  addUserComment(commentUser:CommentClient):Observable<CommentClientResponseApi> {
    return this.#http.post<CommentClientResponseApi>(this.#API_URL + '/client/comment', commentUser);
  }
}
