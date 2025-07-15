import { Routes } from '@angular/router';
import {ProductList} from './product/product-list/product-list';
import {Landing} from './landing/landing';
import {ProductDetail} from './product/product-detail/product-detail';

export const routes: Routes = [
  {path:'', component:Landing},
  {path:'product/:id', component:ProductDetail},
  {path:'products', component: ProductList}
];
