import {ProductService} from '../interfaces/product-service';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {inject} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ProductsApiResponse} from '../../model/product/products-api-response';
import {ProductApiResponse} from '../../model/product/product-api-response';

export class ProductServiceImpl extends ProductService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  getAllProducts(): Observable<ProductsApiResponse> {
    return this.#http.get<ProductsApiResponse>(this.#API_URL + '/products');
  }

  getProductById(productId: number): Observable<ProductApiResponse> {
    return this.#http.get<ProductApiResponse>(this.#API_URL + '/product/' + productId);
  }
}
