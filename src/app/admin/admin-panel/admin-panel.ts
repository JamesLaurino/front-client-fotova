import {Component, inject, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';
import {I18nService} from '../../service/i18n/i18nService';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login/login-service';
import {AdminClient} from '../admin-client/admin-client';
import {AdminProduct} from '../admin-product/admin-product';
import {ProductService} from '../../service/interfaces/product-service';
import {CategoryService} from '../../service/category/categoryService';
import {AdminCategories} from '../admin-categories/admin-categories';

@Component({
  selector: 'app-admin-panel',
  imports: [
    AdminClient,
    AdminProduct,
    AdminCategories
  ],
  templateUrl: './admin-panel.html'
})
export class AdminPanel {

  readonly #userService = inject(UserService);
  readonly #productService = inject(ProductService);
  readonly i18n = inject(I18nService);
  activeComponent= signal("");
  readonly #loginService = inject(LoginService);
  readonly #categoryService = inject(CategoryService);
  readonly #router = inject(Router);

  clients = rxResource({
    stream: () => {
      return this.#userService.getAllClient()
        .pipe(
          map(response => response.data),
          tap(user => console.log(user))
        )
    }
  });

  user = rxResource({
    stream: () => {
      return this.#userService.getUserInformation()
        .pipe(
          map(response => response.data),
          tap(user => {
            this.#userService.client.set(user);
          })
        )
    }
  });

  categories = rxResource({
    stream: () => {
      return this.#categoryService.getAllCategories()
        .pipe(
          map(response => response.data)
        )
    }
  })

  products = rxResource({
    stream: () => {
      return this.#productService.getAllProducts()
        .pipe(
          map(response => response.data)
        )
    }
  })

  logout() {
    this.#loginService.logout();
    window.location.reload();
    this.#router.navigate(['/']);
  }

  manageProducts() {
    this.activeComponent.update((products) => products = "products")
  }

  manageClients() {
    this.activeComponent.update((clients) => clients = "clients")
  }

  manageCategories() {
    this.activeComponent.update((categories) => categories = "categories")
  }

  onCategoryDeleted() {
    this.categories.reload();
  }
}
