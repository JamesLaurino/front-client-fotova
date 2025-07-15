import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import urlHelper from '../../helper/url-helper';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-detail.html',
  styles: ''
})
export class ProductDetail {

  readonly #route = inject(ActivatedRoute);
  readonly #productService = inject(ProductService)

  private productId = this.#route.snapshot.params['id'];
  protected readonly urlHelper = urlHelper;

  product = rxResource({
    stream: () => {
      return this.#productService.getProductById(this.productId)
        .pipe(
          map(response => response.data),
          tap(product => console.log(product))
        )
    }
  })
}
