import {OrderDetail} from './order-detail';

export interface OrderDetailApiResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: OrderDetail[]
}
