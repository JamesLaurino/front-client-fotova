import {Component, inject, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login/login-service';
import {UserAddress} from '../user-address/user-address';
import {UserOrder} from '../user-order/user-order';
import {UserComment} from '../user-comment/user-comment';
import {getEmailFromToken} from '../../helper/jwt-helper';
import {UserEdit} from '../user-edit/user-edit';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-user-panel',
  imports: [
    UserAddress,
    UserOrder,
    UserComment,
    UserEdit
  ],
  templateUrl: './user-panel.html',
  styleUrl: 'user-panel.css'
})
export class UserPanel {

  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  readonly #loginService = inject(LoginService);
  activeComponent= signal("");
  readonly i18n = inject(I18nService);

  user = rxResource({
    stream: () => {
      return this.#userService.getUserInformation()
        .pipe(
          map(response => response.data),
          tap(user => console.log(user))
        )
    }
  });

  orders = rxResource({
    stream: () => {
      const token = getEmailFromToken(String(localStorage.getItem("token")));
      return this.#userService.getOrdersByEmail(String(token))
        .pipe(
          map(response => response.data),
          tap(orders => console.log(orders))
        )
    }
  })

  onAddressUpdated() {
    this.user.reload();
  }

  onCommentUpdated() {
    this.user.reload();
  }

  logout() {
    this.#loginService.logout();
    window.location.reload();
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

  displayEditAddress() {
    this.activeComponent.update((address) => address = "edit-address")
  }
}
