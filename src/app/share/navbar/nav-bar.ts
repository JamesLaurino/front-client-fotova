import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CartService} from '../../service/interfaces/cart-service';
import {CartHelper} from '../../helper/cart-helper';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styles: ''
})
export class NavBar {

  readonly #router = inject(Router)
  readonly #cartService = inject(CartService)
  cartHelper = inject(CartHelper)

  goToCart() {
    console.log('goToCart');
    this.#router.navigate(['/cart']);
  }

  goToAllProducts() {
    this.#router.navigate(['/']);
  }
}
