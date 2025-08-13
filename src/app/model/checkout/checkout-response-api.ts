import {StripeResponse} from '../stripe/StripeResponse';

export interface CheckoutResponseApi {
  responseCode:number;
  responseMessage:string;
  data:StripeResponse;
}
