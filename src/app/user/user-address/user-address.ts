import {Component, input, InputSignal} from '@angular/core';
import {ClientAddress} from '../../model/client/client-address';

@Component({
  selector: 'app-user-address',
  imports: [],
  templateUrl: './user-address.html',
  styleUrl: './user-address.css'
})
export class UserAddress {
  userAddressInput:InputSignal<ClientAddress | undefined> = input.required<ClientAddress | undefined>();
}
