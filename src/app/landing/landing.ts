import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styles: ''
})
export class Landing {

  readonly #router = inject(Router)

  goToProduct() {
    this.#router.navigate(['/products']);
  }
}
