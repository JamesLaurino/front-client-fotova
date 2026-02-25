import {Component, computed, inject} from '@angular/core';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import urlHelper from '../../helper/url-helper';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import {Router} from '@angular/router';
import {I18nService} from '../../service/i18n/i18nService';
import {LabelService} from '../../service/label/label-service';
import {LabelModel} from '../../model/label/label-model';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductBorderDirective
  ],
  templateUrl: './product-list.html',
  styles: ''
})
export class ProductList
{
  readonly #productService = inject(ProductService)
  readonly #labelService = inject(LabelService);
  readonly #router = inject(Router)
  protected readonly urlHelper = urlHelper;
  readonly i18n = inject(I18nService);

  labels = rxResource({
    stream: () => {
      return this.#labelService.getAllLabels()
        .pipe(
          map(response => response.data)
        )
    }
  })

  labelsByProductId = computed(() => {
    const labels = this.labels.value();
    if (!labels) return new Map<number, LabelModel>();

    return new Map(
      labels.map(label => [label.productId, label])
    );
  });


  products = rxResource({
    stream: () => {
      return this.#productService.getAllProducts()
        .pipe(
          map(response => response.data)
        )
    }
  })

  goToProductDetail(id:number) {
    this.#router.navigate(['/product', id]);
  }
}
