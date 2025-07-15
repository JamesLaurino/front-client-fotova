import {Component, inject} from '@angular/core';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import urlHelper from '../../helper/url-helper';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styles: ''
})
export class ProductList
{
  readonly #productService = inject(ProductService)
  protected readonly urlHelper = urlHelper;

  products = rxResource({
    stream: () => {
      return this.#productService.getAllProducts()
        .pipe(
          map(response => response.data)
        )
    }
  })
}
