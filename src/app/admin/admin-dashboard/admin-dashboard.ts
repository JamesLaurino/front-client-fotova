import {Component, computed, inject, input, output} from '@angular/core';
import {CurrencyPipe, DatePipe, LowerCasePipe} from '@angular/common';
import {ClientAll} from '../../model/client/client-all';
import {ProductModel} from '../../model/product/product-model';
import {CategoryModel} from '../../model/category/category-model';
import {OrderAdminModel} from '../../model/order/order-admin-model';
import {OrderDetail} from '../../model/order/order-detail';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CurrencyPipe, DatePipe, LowerCasePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {

  readonly i18n = inject(I18nService);

  clients = input<ClientAll[] | undefined>();
  products = input<ProductModel[] | undefined>();
  categories = input<CategoryModel[] | undefined>();
  orders = input<OrderAdminModel[] | undefined>();
  ordersDetailed = input<OrderDetail[] | undefined>();

  navigate = output<string>();

  totalRevenue = computed(() =>
    (this.ordersDetailed() ?? []).reduce((sum, o) => sum + o.total, 0)
  );

  pendingOrders = computed(() =>
    (this.orders() ?? []).filter(o => !o.isDone).length
  );

  recentOrders = computed(() =>
    [...(this.ordersDetailed() ?? [])]
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
      .slice(0, 5)
  );

  getOrderStatus(orderId: number): boolean {
    return this.orders()?.find(o => o.id === orderId)?.isDone ?? false;
  }
}
