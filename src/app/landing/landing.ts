import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {CommentService} from '../service/comment/commentService';
import {I18nService} from '../service/i18n/i18nService';
import {CartService} from '../service/interfaces/cart-service';

@Component({
  selector: 'app-landing',
  imports: [
    DatePipe
  ],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing {

  private commentService = inject(CommentService);
  readonly #router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(I18nService);
  readonly #cartService = inject(CartService)

  comments = rxResource({
    stream: () => {
      return this.commentService.getAllComments()
        .pipe(
          map(response => response.data)
        )
    }
  })


  constructor() {
    this.checkRouteAction();
  }

  private checkRouteAction() {
    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.map(segment => segment.path).join('/');
      if (currentPath === 'success') {
        this.onSuccessRoute();
      }
    });
  }

  private onSuccessRoute() {
    this.#cartService.getCarts().subscribe(carts => {
      if (!carts || carts.length === 0) return;
      for (const item of carts) {
        this.#cartService.clearCart(String(item.name));
      }
      window.location.reload();
    });
  }

  goToProduct() {
    this.#router.navigate(['/products']);
  }

  goToContactPage() {
    this.#router.navigate(['/contact']);
  }
}
