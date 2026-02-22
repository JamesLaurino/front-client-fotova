import {Component, EventEmitter, inject, input, InputSignal, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../service/category/categoryService';
import {I18nService} from '../../service/i18n/i18nService';
import {ToasterService} from '../../service/toaster/toasterService';
import {CategoryModel} from '../../model/category/category-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-category-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-category-create.html',
  styleUrls: ['./admin-category-create.css']
})
export class AdminCategoryCreate {

  readonly #categoryService = inject(CategoryService);
  private toasterService = inject(ToasterService);
  readonly i18n = inject(I18nService);
  readonly #router = inject(Router);

  @Output() displayFormUpdate = new EventEmitter<void>();
  isDisplayForm:InputSignal<boolean | undefined> = input.required<boolean | undefined>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  get name() {
    return this.form.get('name') as FormControl;
  }

  onSubmit() {
    if (this.form.valid) {

      let categoryCreated:Omit<CategoryModel, "id"> = {
        name: this.name.value
      }

      this.#categoryService.createCategory(categoryCreated).subscribe({
        next: () => {
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation("SUCCESS"),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Création de la catégorie crée avec success'
          });
          this.displayFormUpdate.emit();
          this.#router.navigate(['/admin'],{queryParams:{active:'categories'}});
        },
        error: (err) => {
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation("ERROR"),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/error.gng',
            toastMessage: 'Echec de création de la catégorie : ' + err.error.errorList[0]
          });
        },
      })
    }
  }

  hideForm() {
    this.displayFormUpdate.emit();
  }
}
