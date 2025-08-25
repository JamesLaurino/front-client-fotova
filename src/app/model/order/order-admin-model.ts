import {ClientOrder} from '../client/client-order';

export interface OrderAdminModel {
  id:number;
  createAt:string;
  client:ClientOrder;
}
