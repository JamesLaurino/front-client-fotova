import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import urlHelper from '../../helper/url-helper';
import {CurrencyPipe} from '@angular/common';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CART_RULES} from '../../model/cart/cart-rule';
import {CartService} from '../../service/interfaces/cart-service';
import {CartHelper} from '../../helper/cart-helper';
import cartProductHelper from '../../helper/cart-product-helper';
import {ToasterService} from '../../service/toaster/toasterService';

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
  readonly #router = inject(Router)
  readonly #productService = inject(ProductService)
  readonly #cartService = inject(CartService)
  toasterService = inject(ToasterService)
  cartHelper = inject(CartHelper)

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
    let cartProduct = cartProductHelper(this.product, this.cartQuantity);

    this.#cartService.addToCart(String(this.product.value()?.name),cartProduct).subscribe(() => {
      return;
    })

    this.cartHelper.cartsQuantity.update((n:number) => n + Number(this.cartQuantity.value));

    this.toasterService.show({
      toastMessage: "Produit ajouté au panier !",
      toastTitle:"Pannier mis à jours",
      toastImageUrl :'/fotova/check.jpg',
      toastTime : 'il y a 1 min'
    });
  }

  goToProductList() {
    this.#router.navigate(['/products']);
  }

  decrementCartQuantity() {
    this.cartQuantity.setValue(this.cartQuantity.value - 1);
  }

  incrementCartQuantity() {
    this.cartQuantity.setValue(this.cartQuantity.value + 1);
  }
}
