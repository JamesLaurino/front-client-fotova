import {Component, inject} from '@angular/core';
import {I18nService} from '../service/i18n/i18nService';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
})
export class LanguageSelector {
  readonly i18n = inject(I18nService);

  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    this.i18n.setLanguage(selectedLang);
  }
}
