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
  styleUrls: ['./nav-bar.css']
})
export class NavBar {

  readonly #router = inject(Router)
  public cartHelper = inject(CartHelper)
  public loginHelper = inject(LoginHelper)
  readonly i18n = inject(I18nService);
  public userService = inject(UserService);

  setLanguage(lang: string): void {
    this.i18n.setLanguage(lang);
  }

  getLanguage(): string {
    if(this.i18n.getLanguage() == "fr") {
      return "Français";
    } else if (this.i18n.getLanguage() == "en") {
      return "English";
    } else if (this.i18n.getLanguage() == "ru") {
      return "Русский"
    } else {
      return "English"
    }
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
