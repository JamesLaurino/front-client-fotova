import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutModel} from '../../model/checkout/checkout-model';
import {CheckoutResponseApi} from '../../model/checkout/checkout-response-api';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  processCheckout(checkoutData:CheckoutModel):Observable<CheckoutResponseApi> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.#http.post<CheckoutResponseApi>(this.#API_URL + '/checkout',checkoutData,{headers});
  }
}
