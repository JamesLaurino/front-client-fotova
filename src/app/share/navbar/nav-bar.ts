import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CartService} from '../../service/interfaces/cart-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styles: ''
})
export class NavBar {

  readonly #router = inject(Router)
  readonly #cartService = inject(CartService)

  cartsQuantity = computed(() => {
    return this.carts.value()?.reduce((acc, item) => acc + (item.quantity || 0), 0);
  })

  carts = rxResource({
    stream: () => {
      return this.#cartService.getCarts()
        .pipe(
          map(response => response),
          tap(carts => console.log(carts))
        )
    }
  })

  goToCart() {
    console.log('goToCart');
    this.#router.navigate(['/cart']);
  }

  goToAllProducts() {
    this.#router.navigate(['/']);
  }
}
