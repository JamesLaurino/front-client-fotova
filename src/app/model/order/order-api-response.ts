import {OrderModel} from './Order-model';

export interface OrderApiResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: OrderModel[];
}
