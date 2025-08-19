import {CategoryModel} from './category-model';

export interface CategoryResponseDetailApi {
  responseCode:number;
  responseMessage:string;
  data:CategoryModel;
}
