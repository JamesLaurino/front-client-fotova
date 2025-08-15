import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html'
})
export class AdminPanel {

  readonly #userService = inject(UserService);

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
}
