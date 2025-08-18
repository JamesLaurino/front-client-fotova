import {Component, inject, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';
import {I18nService} from '../../service/i18n/i18nService';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login/login-service';
import {AdminClient} from '../admin-client/admin-client';

@Component({
  selector: 'app-admin-panel',
  imports: [
    AdminClient
  ],
  templateUrl: './admin-panel.html'
})
export class AdminPanel {

  readonly #userService = inject(UserService);
  readonly i18n = inject(I18nService);
  activeComponent= signal("");
  readonly #loginService = inject(LoginService);
  readonly #router = inject(Router);

  clients = rxResource({
    stream: () => {
      return this.#userService.getAllClient()
        .pipe(
          map(response => response.data),
          tap(user => console.log(user))
        )
    }
  });

  user = rxResource({
    stream: () => {
      return this.#userService.getUserInformation()
        .pipe(
          map(response => response.data),
          tap(user => {
            this.#userService.client.set(user);
          })
        )
    }
  });

  logout() {
    this.#loginService.logout();
    window.location.reload();
    this.#router.navigate(['/']);
  }

  manageClients() {
    this.activeComponent.update((clients) => clients = "clients")
  }
}
