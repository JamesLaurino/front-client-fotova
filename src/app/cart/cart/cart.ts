import {Component, inject} from '@angular/core';
import {CartService} from '../../service/interfaces/cart-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import urlHelper from '../../helper/url-helper';
import {CartProduct} from '../../model/cart/cart-product';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    DecimalPipe,
  ],
  templateUrl: './cart.html',
  styles: ''
})
export class Cart
{
  readonly #cartService = inject(CartService)
  readonly #router = inject(Router)
  protected readonly urlHelper = urlHelper;


  carts = rxResource({
    stream: () => {
      return this.#cartService.getCarts()
        .pipe(
          map(response => response),
          tap(carts => console.log(carts))
        )
    }
  })

  order() {

  }

  increment(key:string, cartProduct: CartProduct) {
    let cartProductUpdate = { ...cartProduct };
    cartProductUpdate.quantity += 1;
    console.log(cartProductUpdate)
    this.#cartService.updateCart(key, cartProductUpdate);
    window.location.reload();
  }

  removeItem(key:string) {
    this.#cartService.clearCart(key);
    window.location.reload();
  }

  decrement(key:string, cartProduct: CartProduct) {
    let cartProductUpdate = { ...cartProduct };
    cartProductUpdate.quantity -= 1;
    console.log(cartProductUpdate)
    this.#cartService.updateCart(key, cartProductUpdate);
    window.location.reload();
  }

  totalPrice = rxResource({
    stream: () => {
      return this.#cartService.getCartTotalPrice()
        .pipe(
          map(response => response),
          tap(total => console.log(total))
        )
    }
  })

  goToAllProducts() {
    this.#router.navigate(['/products']);
  }
}
