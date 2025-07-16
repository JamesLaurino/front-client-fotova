import {CartServiceStorageImpl} from '../cart/cart-service-storage-impl';

export default function CartFactory() {
  return new CartServiceStorageImpl();
}
