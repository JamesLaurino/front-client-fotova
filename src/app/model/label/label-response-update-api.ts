import {LabelModel} from './label-model';

export interface LabelResponseUpdateApi {
  responseCode:number;
  responseMessage:string;
  data:LabelModel;
}
