import {LoginApiData} from './login-api-data';

export interface LoginApiResponse {
  responseCode:number;
  responseMessage:string;
  data:LoginApiData;
}
