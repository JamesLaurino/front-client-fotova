import {Client} from './client';

export interface ClientResponseApi {
  responseCode:number;
  responseMessage:string;
  data:Client;
}
