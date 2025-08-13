import {ProductBasket} from '../product/product-basket';

export interface CheckoutModel {
  amount:number;
  quantity:number;
  currency:string;
  name:string;
  email:string;
  productBasket:ProductBasket[];
}
