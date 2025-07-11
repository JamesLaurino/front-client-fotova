import { Routes } from '@angular/router';
import {ProductList} from './product/product-list/product-list';
import {Landing} from './landing/landing';

export const routes: Routes = [
  {path:'', component:Landing},
  {path:'products', component: ProductList}
];
