import {LabelModel} from './label-model';


export interface LabelResponseApi {
  responseCode:number;
  responseMessage:string;
  data:LabelModel[];
}
