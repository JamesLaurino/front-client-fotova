import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styles: ''
})
export class NavBar {

  readonly #router = inject(Router)


  goToAllProducts() {
    this.#router.navigate(['/']);
  }
}
