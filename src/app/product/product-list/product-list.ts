import {Component, inject} from '@angular/core';
import {ProductService} from '../../service/interfaces/product-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import urlHelper from '../../helper/url-helper';
import {ProductBorderDirective} from '../../share/directives/product-border-directive';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductBorderDirective
  ],
  templateUrl: './product-list.html',
  styles: ''
})
export class ProductList
{
  readonly #productService = inject(ProductService)
  readonly #router = inject(Router)
  protected readonly urlHelper = urlHelper;

  products = rxResource({
    stream: () => {
      return this.#productService.getAllProducts()
        .pipe(
          map(response => response.data)
        )
    }
  })

  goToProductDetail(id:number) {
    this.#router.navigate(['/product', id]);
  }
}
