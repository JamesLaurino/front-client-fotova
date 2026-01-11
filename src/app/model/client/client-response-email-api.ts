import {ClientEmail} from './client-email';

export interface ClientResponseEmailApi {
  responseCode:number;
  responseMessage:string;
  data:ClientEmail;
}
