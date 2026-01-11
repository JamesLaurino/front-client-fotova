import {Component, EventEmitter, inject, input, InputSignal, Output} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {ProductModel} from '../../model/product/product-model';
import {Router} from '@angular/router';
import urlHelper from '../../helper/url-helper';
import {LowerCasePipe} from "@angular/common";
import {ProductService} from '../../service/interfaces/product-service';
import {ToasterService} from '../../service/toaster/toasterService';

@Component({
  selector: 'app-admin-product',
    imports: [
        LowerCasePipe
    ],
  templateUrl: './admin-product.html',
  styleUrls: ['./admin-product.css']
})
export class AdminProduct {
  readonly i18n = inject(I18nService);
  readonly #router = inject(Router);
  readonly #productService = inject(ProductService);
  private toasterService = inject(ToasterService);
  protected readonly urlHelper = urlHelper;

  productsInput:InputSignal<ProductModel[] | undefined> = input.required<ProductModel[] | undefined>();
  @Output() productDeleted = new EventEmitter<unknown>();

  goToProductDetail(id: number) {
    this.#router.navigate(['/admin/product', id]);
  }

  createProduct() {
    this.#router.navigate(['/admin/create/product']);
  }

  deleteProduct(id: number) {
    this.#productService.deleteProduct(id).subscribe({
      next: () => {
        this.toasterService.show({
          toastTitle: 'Succès',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Produit supprimé avec success.'
        });
        this.productDeleted.emit(id);
      },
      error: () => {
        this.toasterService.show({
          toastTitle: 'Echec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.jpg',
          toastMessage: "Le produit n'a pas pu être supprimé."
        });
      },
    })
  }
}
