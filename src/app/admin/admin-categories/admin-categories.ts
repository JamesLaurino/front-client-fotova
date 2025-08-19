import {Component, inject, input, InputSignal} from '@angular/core';
import {CategoryModel} from '../../model/category/category-model';
import {I18nService} from '../../service/i18n/i18nService';
import {LowerCasePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  imports: [
    LowerCasePipe
  ],
  templateUrl: './admin-categories.html',
})
export class AdminCategories {
  categoriesInput:InputSignal<CategoryModel[] | undefined> = input.required<CategoryModel[] | undefined>();
  readonly #router = inject(Router);
  readonly i18n = inject(I18nService);

  goToCategoryDetail(id: number) {
    this.#router.navigate(['/admin/category', id]);
  }

  goToCategoryCreate() {
    this.#router.navigate(['/admin/category/add']);
  }
}
