import {environment} from '../../../environments/environment';
import {ProductServiceImpl} from '../product/product-service-impl';
import {ProductService} from '../interfaces/product-service';

export default function ProductFactory():ProductService {
  return environment.production ? new ProductServiceImpl() : new ProductServiceImpl();
}
