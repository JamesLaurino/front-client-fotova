import {categoryInnerProductDto} from './product-category-dto';

export interface ProductModel {
      id:number,
      name:string,
      quantity:number,
      price:number,
      categoryInnerProductDto:categoryInnerProductDto,
      url:string,
      images:string[]
}
