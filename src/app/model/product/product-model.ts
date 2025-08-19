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

/*
{
  "id":1,
  "name": "Dell i9 updated",
  "price": 25.5,
  "url": "photo Dell i9",
  "quantity": 3,
  "categoryInnerProductDto": {
    "id": 1,
    "name": "Laptop"
  }
}
* */
