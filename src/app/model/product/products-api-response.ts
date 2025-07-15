import {ProductModel} from './product-model';

export interface ProductsApiResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: ProductModel[];
}
