import {Component, EventEmitter, inject, Input, input, InputSignal, Output, signal} from '@angular/core';
import {CategoryModel} from '../../model/category/category-model';
import {I18nService} from '../../service/i18n/i18nService';
import {LowerCasePipe} from '@angular/common';
import {Router} from '@angular/router';
import {AdminCategoryCreate} from '../admin-category-create/admin-category-create';
import {CategoryService} from '../../service/category/categoryService';
import {ToasterService} from '../../service/toaster/toasterService';
import {ProductModel} from '../../model/product/product-model';

@Component({
  selector: 'app-admin-categories',
  imports: [
    LowerCasePipe,
    AdminCategoryCreate
  ],
  templateUrl: './admin-categories.html',
  styleUrls:['./admin-categorie.css']
})
export class AdminCategories {
  categoriesInput:InputSignal<CategoryModel[] | undefined> = input.required<CategoryModel[] | undefined>();
  @Output() categoryDeleted = new EventEmitter<unknown>();
  productsInput: InputSignal<ProductModel[] | undefined> = input.required<ProductModel[] | undefined>();
  isDisplayForm = signal(false);

  readonly #router = inject(Router);
  readonly i18n = inject(I18nService);
  private toasterService = inject(ToasterService);
  readonly #categoryService = inject(CategoryService);

  goToCategoryDetail(id: number) {
    this.#router.navigate(['/admin/category', id]);
  }

  displayCategoryForm() {
    this.isDisplayForm.update((displayForm) => displayForm = true);
  }

  isDisplayFormUpdate() {
    this.isDisplayForm.update((displayForm) => displayForm = false);
    this.categoryDeleted.emit();
  }

  checkIfCategoryIsAssociateWithProduct(id:number):boolean {
    for(let product of this.productsInput()!) {
      if(product.categoryInnerProductDto.id == id) {
        return true;
      }
    }
    return false;
  }

  deleteCategory(id: number) {

    if(this.checkIfCategoryIsAssociateWithProduct(id)) {
      alert("Deletion impossible un produit est associé à cette catégorie")
    }
    else {
      if (confirm("Are you sure to delete the category ?")) {
        this.#categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.toasterService.show({
              toastTitle: 'Succès',
              toastTime: 'Just now',
              toastImageUrl: '/fotova/check.jpg',
              toastMessage: 'Catégorie supprimée avec success.'
            });
            this.categoryDeleted.emit();
          },
          error: (err) => {
            this.toasterService.show({
              toastTitle: 'Error',
              toastTime: 'Just now',
              toastImageUrl: '/fotova/error.png',
              toastMessage: 'Echec de la suppression de la catégorie : ' + err.error.errorList[0]
            });
          },
        })
      }
    }
  }
}
