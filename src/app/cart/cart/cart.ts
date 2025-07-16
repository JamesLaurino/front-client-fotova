import {Component, inject} from '@angular/core';
import {CartService} from '../../service/interfaces/cart-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import urlHelper from '../../helper/url-helper';

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

  totalPrice = rxResource({
    stream: () => {
      return this.#cartService.getCartTotalPrice()
        .pipe(
          map(response => response),
          tap(total => console.log(total))
        )
    }
  })
}
