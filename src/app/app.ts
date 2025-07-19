import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBar} from './share/navbar/nav-bar';
import {CartService} from './service/interfaces/cart-service';
import {CartHelper} from './helper/cart-helper';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
  templateUrl: './app.html',
  styles: ''
})
export class App {

  readonly #cartService = inject(CartService)
  readonly #cartHelper = inject(CartHelper)

  constructor() {
    this.#cartService.getCarts().subscribe(
      (carts) => {
        this.#cartHelper.cartsQuantity.update((n:number) => n = 0);
        for (const item of carts) {
          this.#cartHelper.cartsQuantity.update((n:number) => n += item.quantity)
        }
      }
    )
  }
}
