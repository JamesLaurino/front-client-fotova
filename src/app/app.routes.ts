import { Routes } from '@angular/router';
import {ProductList} from './product/product-list/product-list';
import {Landing} from './landing/landing';
import {ProductDetail} from './product/product-detail/product-detail';
import {Cart} from './cart/cart/cart';
import {Checkout} from './cart/checkout/checkout';
import {AuthGuard} from './core/auth-guard';
import {Login} from './connection/login/login';
import {CheckoutGuard} from './core/checkout-guard';
import {UserPanel} from './user/user-panel/user-panel';

export const routes: Routes = [
  {path:'', component:Landing},
  {path:'product/:id', component:ProductDetail},
  {path:'products', component: ProductList},
  {path:'cart', component: Cart},
  {path:'login', component: Login},
  {path:'user', component: UserPanel},
  {
    path:'checkout',
    canActivate: [AuthGuard,CheckoutGuard],
    component: Checkout
  },
];
