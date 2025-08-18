import {ClientAll} from './client-all';

export interface ClientDetailResponseApi {
  responseCode:number;
  responseMessage:string;
  data:ClientAll;
}
