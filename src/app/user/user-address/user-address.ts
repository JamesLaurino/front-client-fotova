import {Component, inject, input, InputSignal} from '@angular/core';
import {ClientAddress} from '../../model/client/client-address';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-user-address',
  imports: [],
  templateUrl: './user-address.html',
  styleUrl: './user-address.css'
})
export class UserAddress {
  userAddressInput:InputSignal<ClientAddress | undefined> = input.required<ClientAddress | undefined>();
  readonly i18n = inject(I18nService);
}
