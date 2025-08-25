import {ProductService} from '../interfaces/product-service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {inject} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ProductsApiResponse} from '../../model/product/products-api-response';
import {ProductApiResponse} from '../../model/product/product-api-response';
import {ProductUpdate} from '../../model/product/product-update';
import {ProductAdd} from '../../model/product/product-add';
import {ProductDeleteApiResponse} from '../../model/product/product-delete-api-response';

export class ProductServiceImpl extends ProductService {
  readonly #API_URL = environment.apiUrl;

  readonly #http:HttpClient = inject(HttpClient)

  deleteProduct(productId: number): Observable<ProductDeleteApiResponse> {
    return this.#http.delete<ProductDeleteApiResponse>(this.#API_URL + '/product/' + productId + '/delete');
  }

  getAllProducts(): Observable<ProductsApiResponse> {
    return this.#http.get<ProductsApiResponse>(this.#API_URL + '/products');
  }

  getProductById(productId: number): Observable<ProductApiResponse> {
    return this.#http.get<ProductApiResponse>(this.#API_URL + '/product/' + productId);
  }

  getProductsByCategoryId(categoryId: number): Observable<ProductsApiResponse> {
    return this.#http.get<ProductsApiResponse>(this.#API_URL + '/products/category/' + categoryId);
  }

  addProductWithCategory(product: ProductAdd,categoryId:number): Observable<ProductApiResponse> {
    return this.#http.post<ProductApiResponse>(this.#API_URL + '/product/' + categoryId + '/add', product);
  }

  updateProduct(product: ProductUpdate): Observable<ProductApiResponse> {
    console.log("UPDATE")
    console.log(product);
    return this.#http.put<ProductApiResponse>(this.#API_URL + '/product/update', product);
  }
}
