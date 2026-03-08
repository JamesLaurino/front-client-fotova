import {CartService} from '../interfaces/cart-service';
import {CartProduct} from '../../model/cart/cart-product';
import {map, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {ProductService} from '../interfaces/product-service';

export class CartServiceStorageImpl implements CartService
{

  readonly #productService = inject(ProductService)

  getCarts(): Observable<CartProduct[]> {

    return this.#productService.getAllProducts().pipe(
      map(response => response.data),
      map(products => {

        const result: CartProduct[] = [];

        for (let i = 0; i < localStorage.length; i++) {

          const key = localStorage.key(i);
          if (!key || key === "token") continue;

          const productExists = products.some(p => p.name === key);
          if (!productExists) continue;

          const data = localStorage.getItem(key);

          try {
            if (data) {
              const parsed = JSON.parse(data);
              result.push(parsed);
            }
          } catch {
            continue;
          }
        }

        return result;
      })
    );
  }

  clearCart(key:string):void{
    localStorage.removeItem(key);
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

  updateCart(key: string, cartProduct: CartProduct):void {
    localStorage.setItem(key, JSON.stringify(cartProduct));
    console.log("Storage updated")
  }

}
