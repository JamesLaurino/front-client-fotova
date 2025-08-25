import {OrderAdminModel} from './order-admin-model';

export interface OrderAdminApiResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: OrderAdminModel[];
}
