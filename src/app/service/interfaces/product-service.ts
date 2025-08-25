import {Observable} from 'rxjs';
import {ProductsApiResponse} from '../../model/product/products-api-response';
import {ProductApiResponse} from '../../model/product/product-api-response';
import {ProductUpdate} from '../../model/product/product-update';
import {ProductAdd} from '../../model/product/product-add';
import {ProductDeleteApiResponse} from '../../model/product/product-delete-api-response';

export abstract class ProductService {
  abstract getAllProducts():Observable<ProductsApiResponse>;
  abstract getProductById(productId:number):Observable<ProductApiResponse>;
  abstract getProductsByCategoryId(categoryId: number): Observable<ProductsApiResponse>;
  abstract updateProduct(product:ProductUpdate):Observable<ProductApiResponse>;
  abstract  addProductWithCategory(product: ProductAdd,categoryId:number): Observable<ProductApiResponse>
  abstract deleteProduct(productId:number):Observable<ProductDeleteApiResponse>;
}
