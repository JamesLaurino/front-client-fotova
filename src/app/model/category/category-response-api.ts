import {CategoryModel} from './category-model';

export interface CategoryResponseApi {
  responseCode:number;
  responseMessage:string;
  data:CategoryModel[];
}
