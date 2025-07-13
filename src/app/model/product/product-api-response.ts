import {ProductModel} from './product-model';

export interface ProductApiResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: ProductModel[];
}
