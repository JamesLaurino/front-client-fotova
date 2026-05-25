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

  readonly #groupedOrders = computed(() => {
    const map = new Map<number, OrderModel[]>();
    (this.ordersInput() ?? []).forEach(o => {
      if (!map.has(o.orderId)) map.set(o.orderId, [o]);
      else map.get(o.orderId)!.push(o);
    });
    return Array.from(map.values());
  });

  totalOrders = computed(() => this.#groupedOrders().length);

  totalSpent = computed(() =>
    this.#groupedOrders().reduce((sum, group) =>
      sum + group.reduce((s, item) => s + item.price * item.quantity, 0), 0)
  );

  lastOrderDate = computed(() => {
    const groups = this.#groupedOrders();
    if (!groups.length) return null;
    return [...groups]
      .sort((a, b) => new Date(b[0].creationDate).getTime() - new Date(a[0].creationDate).getTime())[0][0].creationDate;
  });

  reviewsCount = computed(() => (this.userInput()?.comments ?? []).length);

  recentOrders = computed(() =>
    [...this.#groupedOrders()]
      .sort((a, b) => new Date(b[0].creationDate).getTime() - new Date(a[0].creationDate).getTime())
      .slice(0, 3)
  );

  getOrderTotal(group: OrderModel[]): number {
    return group.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
