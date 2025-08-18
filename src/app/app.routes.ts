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
import {Register} from './connection/register/register';
import {CategoryList} from './category/category-list/category-list';
import {CategoryDetail} from './category/category-detail/category-detail';
import {Contact} from './contact/contact/contact';
import {AuthGuardAdmin} from './core/auth-guard-admin';
import {AdminPanel} from './admin/admin-panel/admin-panel';
import {AdminClientDetail} from './admin/admin-client-detail/admin-client-detail';

export const routes: Routes = [
  {path:'', component:Landing},
  {path:'product/:id', component:ProductDetail},
  {path:'products', component: ProductList},
  {path:'cart', component: Cart},
  {path:'register', component: Register},
  {path:'categories', component: CategoryList},
  {path:'category/:id', component: CategoryDetail},
  {path:'contact', component: Contact},
  {path:'login', component: Login},
  {
    path:'user',
    canActivate: [AuthGuard],
    component: UserPanel
  },
  {
    path:'admin',
    canActivate: [AuthGuardAdmin],
    component: AdminPanel
  },
  {
    path:'admin/client/:id',
    canActivate: [AuthGuardAdmin],
    component: AdminClientDetail
  },
  {
    path:'checkout',
    canActivate: [AuthGuard,CheckoutGuard],
    component: Checkout
  },
];
