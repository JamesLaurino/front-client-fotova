import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ProductService} from '../../service/interfaces/product-service';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import urlHelper from '../../helper/url-helper';
import {I18nService} from '../../service/i18n/i18nService';
import {LabelService} from '../../service/label/label-service';
import {LabelModel} from '../../model/label/label-model';

@Component({
  selector: 'app-category-detail',
  imports: [
    ProductBorderDirective
  ],
  templateUrl: './category-detail.html',
  styleUrls: ['./category-detail.css']
})
export class CategoryDetail {

  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router)
  readonly #productService = inject(ProductService)
  readonly i18n = inject(I18nService);

  private categoryId = this.#route.snapshot.params['id'];

  readonly #labelService = inject(LabelService);

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
      return this.#productService.getProductsByCategoryId(this.categoryId)
        .pipe(
          map(response => response.data)
        )
    }
  })

  protected readonly urlHelper = urlHelper;

  goToProductDetail(id: number) {
    this.#router.navigate(['/product', id]);
  }
}
