import {Component, input, InputSignal} from '@angular/core';
import {OrderModel} from '../../model/order/Order-model';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-user-order',
  imports: [
    JsonPipe
  ],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css'
})
export class UserOrder {
  userOrdersInput:InputSignal<OrderModel[] | undefined> = input.required<OrderModel[] | undefined>();
}
