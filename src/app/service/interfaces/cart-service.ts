import {CartProduct} from '../../model/cart/cart-product';
import {Observable} from 'rxjs';

export abstract class CartService {
  abstract addToCart(key:string,cartProduct:CartProduct):Observable<CartProduct>;
  abstract getCart(key:string):Observable<CartProduct>;
  abstract getCarts():Observable<CartProduct[]>;
  abstract removeProductFromCart(key:string, cartProduct:CartProduct):Observable<CartProduct>;
  abstract clearCart(key:string):void;
  abstract getCartTotalPrice():Observable<number>;
  abstract updateCart(key:string, cartProduct:CartProduct):void;
}
