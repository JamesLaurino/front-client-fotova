import {ProductModel} from '../../model/product/product-model';
import {Observable} from 'rxjs';
import {ProductApiResponse} from '../../model/product/product-api-response';

export abstract class ProductService {
  abstract getAllProducts():Observable<ProductApiResponse>;
  abstract getProductById(productId:number):Observable<ProductApiResponse>;
}
