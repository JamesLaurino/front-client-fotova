import {Component, computed, inject, input, InputSignal} from '@angular/core';
import {OrderModel} from '../../model/order/Order-model';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {I18nService} from '../../service/i18n/i18nService';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {LabelService} from '../../service/label/label-service';

@Component({
  selector: 'app-user-order',
  imports: [
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css'
})
export class UserOrder {
  userOrdersInput:InputSignal<OrderModel[] | undefined> = input.required<OrderModel[] | undefined>();
  selectedOrder: any[] | null = null;
  readonly #labelService = inject(LabelService);
  readonly i18n = inject(I18nService);

  getOrderTotal(order: any[]): number {
    return order.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  labels = rxResource({
    stream: () => {
      return this.#labelService.getAllLabels()
        .pipe(
          map(response => response.data)
        )
    }
  })

  getLabelForOrder(productName: string) {
    const labels = this.labels.value();
    if (!labels) return undefined;

    return labels.find(label =>
      label.titleEn === productName || label.titleRu === productName ||label.titleFr === productName)
  }

  openOrder(order: any[]) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  ordersOrdered = computed(() => {
    let myMap = new Map<number, OrderModel[]>();
    this.userOrdersInput()?.forEach(order => {
        if (!myMap.has(order.orderId)) {
          myMap.set(order.orderId, [order]);
        } else {
          myMap.get(order.orderId)!.push(order);
        }
    });
    return Array.from(myMap.values());
  })

}
