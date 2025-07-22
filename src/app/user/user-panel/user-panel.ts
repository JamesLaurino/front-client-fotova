import {Component, inject, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';
import urlHelper from '../../helper/url-helper';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login/login-service';
import {UserAddress} from '../user-address/user-address';
import {UserOrder} from '../user-order/user-order';
import {UserComment} from '../user-comment/user-comment';

@Component({
  selector: 'app-user-panel',
  imports: [
    UserAddress,
    UserOrder,
    UserComment
  ],
  templateUrl: './user-panel.html',
  styleUrl: 'user-panel.css'
})
export class UserPanel {

  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  readonly #loginService = inject(LoginService);
  activeComponent= signal("");

  user = rxResource({
    stream: () => {
      return this.#userService.getUserInformation()
        .pipe(
          map(response => response.data),
          tap(user => console.log(user))
        )
    }
  })
  protected readonly urlHelper = urlHelper;

  logout() {
    this.#loginService.logout();
    this.#router.navigate(['/']);
  }

  displayUserAddress() {
    this.activeComponent.update((address) => address = "address")
  }

  displayUserOrder() {
    this.activeComponent.update((address) => address = "order")
  }

  displayUserComment() {
    this.activeComponent.update((address) => address = "comment")
  }
}
