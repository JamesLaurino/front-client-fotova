import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CartHelper} from '../../helper/cart-helper';
import {LoginHelper} from '../../helper/login-helper';
import {I18nService} from '../../service/i18n/i18nService';
import {UserService} from '../../service/user/user-service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styles: [
    `
      .navbar {
        position: relative;
      }
      .navbar-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.8rem;
        font-weight: 500;
        letter-spacing: 1px;
        pointer-events: none;
        white-space: nowrap;
      }
    `
  ]
})
export class NavBar {

  readonly #router = inject(Router)
  public cartHelper = inject(CartHelper)
  public loginHelper = inject(LoginHelper)
  readonly i18n = inject(I18nService);
  public userService = inject(UserService);

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


  goToAdminPanel() {
    this.#router.navigate(['/admin']);
  }
}
