import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {CategoryService} from '../../service/category/categoryService';
import {map, tap} from 'rxjs';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-admin-category-detail',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-category-detail.html',
})
export class AdminCategoryDetail {
  readonly #route = inject(ActivatedRoute);
  readonly #categoryService = inject(CategoryService);
  private categoryId = this.#route.snapshot.params['id'];
  readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      const category = this.category.value();
      if (category) {
        this.form.setValue({
          id: Number(category.id),
          name: category.name,
        });
      }
    });
  }

  category = rxResource({
    stream: () =>
      this.#categoryService.getCategoryById(this.categoryId).pipe(
        map((response) => response.data),
        tap((category) => console.log('API category:', category))
      ),
  });

  form = new FormGroup({
    id: new FormControl({ value: this.categoryId, disabled: true }),
    name: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      // const updatedCategory = {
      //   id: this.categoryId,
      //   name: this.name.value(),
      // };
      // this.#categoryService.updateCategory(updatedCategory).subscribe({
      //   next: () => alert('Catégorie mise à jour ✅'),
      //   error: (err) => console.error(err),
      // });
    }
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

}
