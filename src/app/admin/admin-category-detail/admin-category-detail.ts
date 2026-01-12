import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {CategoryService} from '../../service/category/categoryService';
import {map, tap} from 'rxjs';
import {I18nService} from '../../service/i18n/i18nService';
import {ToasterService} from '../../service/toaster/toasterService';

@Component({
  selector: 'app-admin-category-detail',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-category-detail.html',
  styleUrls: ['./admin-category-detail.css']
})
export class AdminCategoryDetail {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #categoryService = inject(CategoryService);
  private categoryId = this.#route.snapshot.params['id'];
  private toasterService = inject(ToasterService);
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
    console.log("ok")
    if (this.form.valid) {
      const updatedCategory = {
        id: this.categoryId,
        name: this.name.value
      };
      this.#categoryService.updateCategory(updatedCategory).subscribe({
        next: () => {
          this.toasterService.show({
            toastTitle: 'Succès',
            toastTime: 'Just now',
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Mise à jour de la catégorie effectuée avec succès.'
          });
        },
        error: (err) => {
          this.toasterService.show({
            toastTitle: 'Error',
            toastTime: 'Just now',
            toastImageUrl: '/fotova/error.png',
            toastMessage: 'Echec de la mise à jour de la catégorie : ' + err.error.errorList[0]
          });
        },
      });
    }
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  backToPanel() {
    this.#router.navigate(['/admin'],{queryParams:{active:'categories'}});
  }
}
