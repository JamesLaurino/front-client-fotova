import {Component, inject} from '@angular/core';
import {CategoryService} from '../../service/category/categoryService';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import {Router} from '@angular/router';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-category-list',
  imports: [
    ProductBorderDirective
  ],
  templateUrl: './category-list.html',
  styleUrls: []
})
export class CategoryList {
  readonly #categoryService = inject(CategoryService)
  readonly #router = inject(Router)
  readonly i18n = inject(I18nService);

  categories = rxResource({
    stream: () => {
      return this.#categoryService.getAllCategories()
        .pipe(
          map(response => response.data)
        )
    }
  })

  goToCategoryDetails(categoryId:number) {
    this.#router.navigate(['/category', categoryId]);
  }
}
