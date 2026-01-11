import {Component, inject, input, InputSignal} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {ClientAll} from '../../model/client/client-all';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-client',
  imports: [],
  templateUrl: './admin-client.html',
  styleUrls: ['admin-client.css'],
})
export class AdminClient {
  clientsInput:InputSignal<ClientAll[] | undefined> = input.required<ClientAll[] | undefined>();
  readonly #router = inject(Router);
  readonly i18n = inject(I18nService);

  goToClientDetail(id: number) {
    this.#router.navigate(['/admin/client', id]);
  }
}
