import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutConstant {
  ORDER_FEES:number = 15;
  ORDER_FREE_FEES:number = 0;
  ORDER_FREE_FEES_COUNTRY:string = "RUSSIE";
}
