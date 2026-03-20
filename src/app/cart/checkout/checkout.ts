import {Component, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {CartService} from '../../service/interfaces/cart-service';
import {CartProduct} from '../../model/cart/cart-product';
import {CheckoutModel} from '../../model/checkout/checkout-model';
import {ProductBasket} from '../../model/product/product-basket';
import urlHelper from '../../helper/url-helper';
import {UserService} from '../../service/user/user-service';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {ClientResponseApi} from '../../model/client/client-response-api';
import {ToasterService} from '../../service/toaster/toasterService';
import {CheckoutResponseApi} from '../../model/checkout/checkout-response-api';
import {CheckoutService} from '../../service/checkout/checkoutService';
import {I18nService} from '../../service/i18n/i18nService';
import {rxResource} from '@angular/core/rxjs-interop';
import {LabelService} from '../../service/label/label-service';
import {CheckoutConstant} from '../../service/checkout/checkoutConstant';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {

  protected readonly urlHelper = urlHelper;
  private toasterService = inject(ToasterService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private userService = inject(UserService);
  private checkoutService = inject(CheckoutService);
  readonly i18n = inject(I18nService);
  readonly #labelService = inject(LabelService);
  readonly #checkoutConstant = inject(CheckoutConstant);
  public isProduction = environment.production;

  protected readonly environment = environment;

  cartProducts: CartProduct[] = [];
  totalPrice: number = 0;
  isProcessing: boolean = false;
  checkoutData: CheckoutModel = {
    amount: 0,
    quantity: 0,
    currency: '',
    name: '',
    email: '',
    productBasket: []
  };

  ngOnInit() {
    this.loadCartData();
  }

  private loadCartData() {
    this.cartService.getCarts().subscribe(products => {
      this.cartProducts = products;
    });

    this.cartService.getCartTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });
  }

  labels = rxResource({
    stream: () => {
      return this.#labelService.getAllLabels()
        .pipe(
          map(response => response.data)
        )
    }
  })

  getConstant() {
    return {
      ...this.#checkoutConstant
    }
  }

  getFees() {
    if(this.clientDetail.value()?.address.country === this.getConstant().ORDER_FREE_FEES_COUNTRY) {
      return this.getConstant().ORDER_FREE_FEES;
    } else {
      return this.getConstant().ORDER_FEES;
    }
  }

  clientDetail = rxResource({
    stream: () => {
      return this.userService.getUserInformation()
        .pipe(
          map(response => response.data)
        )
    }
  })

  readonly checkoutWithLabels = computed(() => {
    const carts = this.cartProducts;
    const labels = this.labels.value();

    if (!carts || !labels) return [];

    const labelsMap = new Map(
      labels.map(label => [label.productId, label])
    );

    return carts.map(cart => ({
      ...cart,
      label: labelsMap.get(cart.id)
    }));
  });

  getLabelForCheckout(productId: number) {
    const labels = this.labels.value();
    if (!labels) return undefined;

    return labels.find(label => label.productId === productId);
  }

  getItemTotal(product: CartProduct): number {
    return product.price * product.quantity;
  }

  getTotalItems(): number {
    return this.cartProducts.reduce((sum, product) => sum + product.quantity, 0);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  processPaymentMock(): void {
    if (this.cartProducts.length === 0) return;

    this.isProcessing = true;

    console.log(this.totalPrice + this.getFees());

    this.userService.getUserInformation().pipe(
      map((user: ClientResponseApi) => {
        this.checkoutData.amount = this.totalPrice + this.getFees();
        this.checkoutData.quantity = this.getTotalItems();
        this.checkoutData.currency = 'EUR';
        this.checkoutData.name = user.data.username;
        this.checkoutData.email = user.data.email;
        this.checkoutData.productBasket = this.cartProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity
        } as ProductBasket));

        return this.checkoutData; // on passe checkoutData au switchMap
      }),
      switchMap((checkoutData: CheckoutModel) =>
        this.checkoutService.processCheckout(checkoutData)
      ),
      tap((checkoutResponse: CheckoutResponseApi) => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("SUCCESS"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: this.i18n.getTranslation("STRIPE_REDIRECTION_SUCCESS"),
        });
          this.cartService.clearAllStorage();
          window.location.reload();
      }),
      catchError(error => {
        this.isProcessing = false;
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("SUCCESS"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: this.i18n.getTranslation("STRIPE_REDIRECTION_SUCCESS"),
        });
          this.cartService.clearAllStorage();
          window.location.reload();
        return of(null);
      })
    ).subscribe((checkoutResponse: CheckoutResponseApi | null) => {
        this.cartService.clearAllStorage();
      window.location.reload();
    });
  }

  processPayment(): void {
    if (this.cartProducts.length === 0) return;

    this.isProcessing = true;

    console.log(this.totalPrice + this.getFees());

    this.userService.getUserInformation().pipe(
      map((user: ClientResponseApi) => {
        this.checkoutData.amount = this.totalPrice + this.getFees();
        this.checkoutData.quantity = this.getTotalItems();
        this.checkoutData.currency = 'EUR';
        this.checkoutData.name = user.data.username;
        this.checkoutData.email = user.data.email;
        this.checkoutData.productBasket = this.cartProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity
        } as ProductBasket));

        return this.checkoutData; // on passe checkoutData au switchMap
      }),
      switchMap((checkoutData: CheckoutModel) =>
        this.checkoutService.processCheckout(checkoutData)
      ),
      tap((checkoutResponse: CheckoutResponseApi) => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("SUCCESS"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: this.i18n.getTranslation("STRIPE_REDIRECTION_SUCCESS"),
        });
      }),
      catchError(error => {
        console.error('Erreur lors du paiement', error);
        this.isProcessing = false;
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("ERROR"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/error.png',
          toastMessage: this.i18n.getTranslation("PROCESS_ERROR"),
        });
        return of(null);
      })
    ).subscribe((checkoutResponse: CheckoutResponseApi | null) => {
      this.isProcessing = false;
      if (checkoutResponse && checkoutResponse.data?.sessionUrl) {
        window.location.href = checkoutResponse.data.sessionUrl;
      }
    });
  }

}
