import {categoryInnerProductDto} from './product-category-dto';

export interface ProductUpdate {
  id:number,
  name:string,
  price:number,
  quantity:number,
  url:string,
  categoryInnerProductDto:categoryInnerProductDto
}
