import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CartHelper} from '../../helper/cart-helper';
import {LoginHelper} from '../../helper/login-helper';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styles: ''
})
export class NavBar {

  readonly #router = inject(Router)
  public cartHelper = inject(CartHelper)
  public loginHelper = inject(LoginHelper)
  readonly i18n = inject(I18nService);

  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    this.i18n.setLanguage(selectedLang);
  }

  goToCart() {
    this.#router.navigate(['/cart']);
  }

  goToLandingPage() {
    this.#router.navigate(['/']);
  }

  goToAllProducts() {
    this.#router.navigate(['/products']);
  }

  goToUserPanel() {
    this.#router.navigate(['/user']);
  }

  goToLogin() {
    this.#router.navigate(['/login']);
  }

  goToCategories() {
    this.#router.navigate(['/categories']);
  }
}
