import {Component, inject, OnInit} from '@angular/core';
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

  getItemTotal(product: CartProduct): number {
    return product.price * product.quantity;
  }

  getTotalItems(): number {
    return this.cartProducts.reduce((sum, product) => sum + product.quantity, 0);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  processPayment(): void {
    if (this.cartProducts.length === 0) return;

    this.isProcessing = true;

    this.userService.getUserInformation().pipe(
      map((user: ClientResponseApi) => {
        this.checkoutData.amount = Math.round(this.totalPrice * 100);
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
          toastTitle: 'Checkout success',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Le processus de paiement a bien été effectué. Merci pour votre achat !'
        });
      }),
      catchError(error => {
        console.error('Erreur lors du paiement', error);
        this.isProcessing = false;
        this.toasterService.show({
          toastTitle: 'Checkout Error',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/error.png',
          toastMessage: 'Une erreur est survenue pendant le processus'
        });
        return of(null);
      })
    ).subscribe((checkoutResponse: CheckoutResponseApi | null) => {
      this.isProcessing = false;
      if (checkoutResponse) {
        console.log('Réponse finale du paiement :', checkoutResponse);
      }
    });
  }

}
