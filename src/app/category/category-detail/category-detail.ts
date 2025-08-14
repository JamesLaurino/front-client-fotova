import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ProductService} from '../../service/interfaces/product-service';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import urlHelper from '../../helper/url-helper';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-category-detail',
  imports: [
    ProductBorderDirective
  ],
  templateUrl: './category-detail.html',
  styleUrls: []
})
export class CategoryDetail {

  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router)
  readonly #productService = inject(ProductService)
  readonly i18n = inject(I18nService);

  private categoryId = this.#route.snapshot.params['id'];

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
