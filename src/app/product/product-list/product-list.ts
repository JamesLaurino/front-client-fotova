import {Component, computed, inject} from '@angular/core';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {JsonPipe} from '@angular/common';
import {map} from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [
    JsonPipe
  ],
  templateUrl: './product-list.html',
  styles: ''
})
export class ProductList
{

  readonly #productService = inject(ProductService)

  products = rxResource({
    stream: () => {
      return this.#productService.getAllProducts()
        .pipe(
          map(response => response.data)
        )
    }
  })

}
