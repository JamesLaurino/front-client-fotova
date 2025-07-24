import {Observable} from 'rxjs';
import {ProductsApiResponse} from '../../model/product/products-api-response';
import {ProductApiResponse} from '../../model/product/product-api-response';

export abstract class ProductService {
  abstract getAllProducts():Observable<ProductsApiResponse>;
  abstract getProductById(productId:number):Observable<ProductApiResponse>;
  abstract getProductsByCategoryId(categoryId: number): Observable<ProductsApiResponse>;
}
