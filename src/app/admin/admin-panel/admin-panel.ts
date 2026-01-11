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
import {OrderService} from '../../service/order/orderService';
import {AdminOrder} from '../admin-order/admin-order';
import {AdminChart} from '../admin-chart/admin-chart';

@Component({
  selector: 'app-admin-panel',
  imports: [
    AdminClient,
    AdminProduct,
    AdminCategories,
    AdminOrder,
    AdminChart
  ],
  templateUrl: './admin-panel.html',
  styleUrl: 'admin-panel.css'
})
export class AdminPanel {

  readonly #userService = inject(UserService);
  readonly #productService = inject(ProductService);
  readonly i18n = inject(I18nService);
  readonly #loginService = inject(LoginService);
  readonly #categoryService = inject(CategoryService);
  readonly #router = inject(Router);
  readonly #orderService = inject(OrderService);
  activeComponent= signal("");

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

  orders = rxResource({
    stream: () => {
      return this.#orderService.getAllOrders()
        .pipe(
          map(response => response.data)
        )
    }
  })

  ordersDetailed = rxResource({
    stream: () => {
      return this.#orderService.getOrdersDetailed()
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

  manageOrders() {
    this.activeComponent.update((orders) => orders = "orders")
  }

  onProductDeleted() {
    this.products.reload();
  }

  onOrderCompleteUpdate() {
    this.orders.reload();
  }
}
