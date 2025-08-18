import {ClientAll} from './client-all';

export interface ClientResponseAllApi {
  responseCode:number;
  responseMessage:string;
  data:ClientAll[];
}
