import {Component, inject} from '@angular/core';
import {CartService} from '../../service/interfaces/cart-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import urlHelper from '../../helper/url-helper';
import {CartProduct} from '../../model/cart/cart-product';
import {Router} from '@angular/router';
import {CartHelper} from '../../helper/cart-helper';
import {I18nService} from '../../service/i18n/i18nService';
import {LoginHelper} from '../../helper/login-helper';

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
  public cartHelper = inject(CartHelper)
  protected readonly urlHelper = urlHelper;
  public loginHelper = inject(LoginHelper)
  readonly i18n = inject(I18nService);

  carts = rxResource({
    stream: () => {
      return this.#cartService.getCarts()
        .pipe(
          map(response => response),
          tap(carts => {
            this.cartHelper.cartsQuantity.update((n:number) => n = 0);
            for (const item of carts) {
              this.cartHelper.cartsQuantity.update((n:number) => n += item.quantity)
            }
          }),
        )
    }
  })

  order() {
    this.#router.navigate(['/checkout']);
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
