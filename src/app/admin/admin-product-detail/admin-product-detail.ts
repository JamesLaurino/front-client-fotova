import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {ProductService} from '../../service/interfaces/product-service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {I18nService} from '../../service/i18n/i18nService';
import {CategoryService} from '../../service/category/categoryService';
import {ProductUpdate} from '../../model/product/product-update';

@Component({
  selector: 'app-admin-product-detail',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-product-detail.html'
})
export class AdminProductDetail {
  readonly #router = inject(ActivatedRoute)
  private productId = Number(this.#router.snapshot.params['id']);
  readonly #productService = inject(ProductService);
  readonly #categoryService = inject(CategoryService);
  readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      const product = this.product.value();
      const categories = this.categories.value();
      if (product) {
        this.form.setValue({
          id: Number(product.id),
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          categoryInnerProductDto: categories ? categories.map(category => category.name) : [],
        })
      }
    });
  }

  form = new FormGroup({
    id: new FormControl({ value: this.productId, disabled: true }),
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryInnerProductDto: new FormControl<string[]>([], [Validators.required]),
  });

  get name() { return this.form.get('name') as FormControl; }
  get quantity() { return this.form.get('quantity') as FormControl; }
  get price() { return this.form.get('price') as FormControl; }
  get category() { return this.form.get('categoryInnerProductDto') as FormControl; }

  product = rxResource({
    stream: () => {
      return this.#productService.getProductById(this.productId)
        .pipe(
          map(response => response.data),
          tap(product => console.log(product))
        )
    }
  })

  categories = rxResource({
    stream: () => {
      return this.#categoryService.getAllCategories()
        .pipe(
          map(response => response.data),
          tap(product => console.log(product))
        )
    }
  })


  onSubmit() {
    if (this.form.valid) {
      const category = this.categories.value()?.find(c => c.name === String(this.form.value.categoryInnerProductDto));
      let productUpdate: ProductUpdate = {
        id:1,
        name: String(this.name.value),
        price: Number(this.price.value),
        url: String(this.product.value()?.url),
        quantity: Number(this.quantity.value),
        categoryInnerProductDto: {
          id: Number(category?.id),
          name: String(this.form.value.categoryInnerProductDto)
        }
      }
      console.log(productUpdate)
    }
  }

}
