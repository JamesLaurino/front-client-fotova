import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import urlHelper from '../../helper/url-helper';
import {CurrencyPipe} from '@angular/common';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CART_RULES} from '../../model/cart/cart-rule';
import {CartProduct} from '../../model/cart/cart-product';
import {CartService} from '../../service/interfaces/cart-service';

@Component({
  selector: 'app-product-detail',
  imports: [
    CurrencyPipe,
    ProductBorderDirective,
    ReactiveFormsModule
  ],
  templateUrl: './product-detail.html',
  styles: ''
})
export class ProductDetail {

  readonly #route = inject(ActivatedRoute);
  readonly #productService = inject(ProductService)
  readonly #cartService = inject(CartService)

  private productId = this.#route.snapshot.params['id'];
  protected readonly urlHelper = urlHelper;

  @ViewChild('imgSwitch') imgSwitch!: ElementRef;

  readonly form= new FormGroup({
    cartQuantity: new FormControl(1,
      [
        Validators.required,
        Validators.min(CART_RULES.MIN_QUANTITY)
      ]
    )
  });

  get cartQuantity() : FormControl {
    return this.form.get('cartQuantity') as FormControl;
  }

  product = rxResource({
    stream: () => {
      return this.#productService.getProductById(this.productId)
        .pipe(
          map(response => response.data),
          tap(product => console.log(product))
        )
    }
  })

  switchImage(img: string) {
    this.imgSwitch.nativeElement.src = this.urlHelper(img);
  }

  onSubmit():void {
    let cartProduct:CartProduct = {
      "id": Number(this.product.value()?.id),
      "name": String(this.product.value()?.name),
      "price": Number(this.product.value()?.price),
      "quantity": Number(this.cartQuantity.value),
      "url": String(this.product.value()?.url)
    }

    this.#cartService.addToCart(String(this.product.value()?.name),cartProduct).subscribe(() => {
      return;
    })
  }

  decrementCartQuantity() {
    this.cartQuantity.setValue(this.cartQuantity.value - 1);
  }

  incrementCartQuantity() {
    this.cartQuantity.setValue(this.cartQuantity.value + 1);
  }
}
