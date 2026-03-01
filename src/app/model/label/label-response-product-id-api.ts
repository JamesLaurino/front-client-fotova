import {LabelModel} from './label-model';

export interface LabelResponseProductIdApi {
  responseCode:number;
  responseMessage:string;
  data:LabelModel;
}
