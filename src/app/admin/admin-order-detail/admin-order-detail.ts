import {Component, inject} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {OrderService} from '../../service/order/orderService';
import {CurrencyPipe, DatePipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-admin-order-detail',
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './admin-order-detail.html',
})
export class AdminOrderDetail {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly i18n = inject(I18nService);
  readonly #orderService = inject(OrderService);

  private idOrder = this.#route.snapshot.params['id'];
  private userEmail = this.#route.snapshot.params['email'];

  orderDetail = rxResource({
    stream: () => {
      return this.#orderService.getOrderByIdAndEmail(this.idOrder,this.userEmail)
        .pipe(
          map(response => response.data),
          tap(client => console.log(client))
        )
    }
  })

  goBack() {
    this.#router.navigate(['/admin']);
  }
}
