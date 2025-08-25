import {Component, inject, input, InputSignal} from '@angular/core';
import {Router} from '@angular/router';
import {I18nService} from '../../service/i18n/i18nService';
import {OrderAdminModel} from '../../model/order/order-admin-model';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {OrderDetail} from '../../model/order/order-detail';

@Component({
  selector: 'app-admin-order',
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './admin-order.html',
})
export class AdminOrder {
  ordersInput:InputSignal<OrderAdminModel[] | undefined> = input.required<OrderAdminModel[] | undefined>();
  ordersDetailedInput:InputSignal<OrderDetail[] | undefined> = input.required<OrderDetail[] | undefined>();
  readonly #router = inject(Router);
  readonly i18n = inject(I18nService);

  getTotalByOrder(order:OrderAdminModel) {
    let total = 0;
    for(let orderDetail of this.ordersDetailedInput()!) {
      if(orderDetail.orderId == order.id) {
        total += orderDetail.total;
      }
    }
    return total;
  }

  goToOrderDetail(id: number,email:string) {
    this.#router.navigate(['/admin/order', id,email]);
  }
}
