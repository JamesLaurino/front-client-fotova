import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OrderAdminApiResponse} from '../../model/order/order-admin-api-response';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {OrderDetailApiResponse} from '../../model/order/order-detail-api-response';


@Injectable({providedIn: 'root'})
export class OrderService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  getAllOrders(): Observable<OrderAdminApiResponse> {
    return this.#http.get<OrderAdminApiResponse>(this.#API_URL + '/orders');
  }

  getOrdersDetailed(): Observable<OrderDetailApiResponse> {
    return this.#http.get<OrderDetailApiResponse>(this.#API_URL + '/order-products/detailed');
  }

  getOrderByIdAndEmail(orderId: number, email: string): Observable<OrderDetailApiResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('orderId', orderId.toString());

    return this.#http.get<OrderDetailApiResponse>(
      this.#API_URL + '/order-products',
      { params }
    );
  }
}