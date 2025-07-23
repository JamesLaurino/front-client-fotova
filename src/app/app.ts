import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBar} from './share/navbar/nav-bar';
import {CartService} from './service/interfaces/cart-service';
import {CartHelper} from './helper/cart-helper';
import {LoginService} from './service/login/login-service';
import {Toast} from './share/toast/toast';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet, Toast],
  templateUrl: './app.html',
  styles: ''
})
export class App {

  private cartService = inject(CartService);
  private cartHelper = inject(CartHelper);
  private loginService = inject(LoginService);

  constructor() {

    this.cartService.getCarts().subscribe(
      (carts) => {
        this.cartHelper.cartsQuantity.update((n:number) => n = 0);
        for (const item of carts) {
          this.cartHelper.cartsQuantity.update((n:number) => n += item.quantity)
        }
      }
    )
    this.loginService.isLogged();
  }
}
