import {Component, computed, input, InputSignal} from '@angular/core';
import {OrderModel} from '../../model/order/Order-model';
import {CurrencyPipe, DatePipe} from '@angular/common';

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
