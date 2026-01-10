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
        background-color: rgba(52, 48, 48, 0.95) !important;
        backdrop-filter: blur(6px);
        z-index: 1;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      .btn-login {
        background-color: transparent;
        color: white;
        border: 1px solid white;
        border-radius: 25px;
        padding: 6px 16px;
        font-size: 0.9rem;
      }

      .btn-login:hover {
        background-color: white;
        color: #343030;
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

      .btn-language {
        background-color: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 0.85rem;
      }

      .btn-language:hover {
        background-color: rgba(255,255,255,0.1);
      }

      .user-icon {
        background-color: rgba(255,255,255,0.1);
        padding: 6px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }

      .user-icon:hover {
        background-color: rgba(255,255,255,0.25);
      }

      /* Link in navbar */
      .nav-link-premium {
        font-weight: 500;
        font-size: 1.5rem;
        padding: 8px 12px;
        transition: color 0.2s ease;
      }

      .nav-link-premium:hover {
        color: #f0e6d2; /* beige clair cohérent avec cachemire */
      }

      /* Dropdown menu style */
      .dropdown-menu-premium {
        background-color: #343030; /* même que navbar */
        border-radius: 8px;
        min-width: 180px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        padding: 0.3rem 0;
      }

      /* Dropdown items */
      .dropdown-menu-premium .dropdown-item {
        font-size: 0.9rem;
        padding: 8px 16px;
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      .dropdown-menu-premium .dropdown-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #f0e6d2;
      }

      /* Divider style */
      .dropdown-menu-premium .dropdown-divider {
        border-color: rgba(255, 255, 255, 0.2);
        margin: 0.5rem 0;
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

  setLanguage(lang: string): void {
    this.i18n.setLanguage(lang);
  }

  getLanguage(): string {
    if(this.i18n.getLanguage() == "fr") {
      return "Français";
    } else if (this.i18n.getLanguage() == "en") {
      return "English";
    } else {
      return "Anglais"
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
