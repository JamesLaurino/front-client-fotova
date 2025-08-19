import {Component, inject, input, InputSignal} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {ProductModel} from '../../model/product/product-model';
import {Router} from '@angular/router';
import urlHelper from '../../helper/url-helper';

@Component({
  selector: 'app-admin-product',
  imports: [],
  templateUrl: './admin-product.html',
})
export class AdminProduct {
  readonly i18n = inject(I18nService);
  readonly #router = inject(Router);
  protected readonly urlHelper = urlHelper;

  productsInput:InputSignal<ProductModel[] | undefined> = input.required<ProductModel[] | undefined>();

  goToProductDetail(id: number) {
    this.#router.navigate(['/admin/product', id]);
  }
}
