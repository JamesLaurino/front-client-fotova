import {CartService} from '../interfaces/cart-service';
import {CartProduct} from '../../model/cart/cart-product';
import {Observable, of} from 'rxjs';

export class CartServiceStorageImpl implements CartService
{

  getCarts(): Observable<CartProduct[]> {

    const result:CartProduct[] = [];

    for (let i = 0; i < localStorage.length; i++)
    {
      const key = localStorage.key(i);
      if (!key || key === "token") continue;

      const data = localStorage.getItem(key);
      try {
        if (data) {
          const parsed = JSON.parse(data);
            result.push(parsed);
        }
      } catch (e) {
        continue;
      }
    }

    return of(result);
  }

  clearCart(): Observable<CartProduct> {
    return of();
  }

  getCart(key:string): Observable<CartProduct> {
    return of();
  }

  getCartTotalPrice(): Observable<number> {

    let totalPrice:number = 0;
    for (let i = 0; i < localStorage.length; i++)
    {
      const key = localStorage.key(i);
      if (!key || key === "token") continue;

      const data = localStorage.getItem(key);
      try {
        if (data) {
          const parsed = JSON.parse(data);
          totalPrice += (parsed.price) * (parsed.quantity);
        }
      } catch (e) {
        continue;
      }
    }

    return of(totalPrice);
  }

  addToCart(key: string, cartProduct: CartProduct): Observable<CartProduct> {
    localStorage.setItem(key, JSON.stringify(cartProduct));
    return of();
  }

  removeProductFromCart(key: string, cartProduct: CartProduct): Observable<CartProduct> {
    return of();
  }

}
