import {Component, computed, inject, input, output} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Client} from '../../model/client/client';
import {OrderModel} from '../../model/order/Order-model';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-user-dashboard',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard {

  readonly i18n = inject(I18nService);

  userInput = input<Client | undefined>();
  ordersInput = input<OrderModel[] | undefined>();

  navigate = output<string>();

  totalOrders = computed(() => (this.ordersInput() ?? []).length);

  totalSpent = computed(() =>
    (this.ordersInput() ?? []).reduce((sum, o) => sum + o.total, 0)
  );

  lastOrderDate = computed(() => {
    const orders = this.ordersInput() ?? [];
    if (!orders.length) return null;
    return [...orders]
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())[0].creationDate;
  });

  reviewsCount = computed(() => (this.userInput()?.comments ?? []).length);

  recentOrders = computed(() =>
    [...(this.ordersInput() ?? [])]
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
      .slice(0, 3)
  );
}
