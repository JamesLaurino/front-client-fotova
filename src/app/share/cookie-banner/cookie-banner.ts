import {Component, inject, signal} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-cookie-banner',
  imports: [],
  templateUrl: './cookie-banner.html',
  styleUrls: ['./cookie-banner.css']
})
export class CookieBanner {

  readonly visible = signal(!localStorage.getItem('cookie_consent'));
  readonly isClosing = signal(false);
  readonly i18n = inject(I18nService);

  accept(): void {
    this.close('accepted');
  }

  refuse(): void {
    this.close('refused');
  }

  private close(value: string): void {
    this.isClosing.set(true);
    setTimeout(() => {
      localStorage.setItem('cookie_consent', value);
      this.visible.set(false);
    }, 400);
  }
}
