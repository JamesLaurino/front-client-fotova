import {Component, inject} from '@angular/core';
import {CartService} from '../../service/interfaces/cart-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {DecimalPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './cart.html',
  styles: ''
})
export class Cart {
  readonly #cartService = inject(CartService)

  produits = [
    {
      id: 1,
      nom: 'Casque Bluetooth',
      prix: 59.99,
      quantite: 2,
      image: 'https://via.placeholder.com/100x100?text=Casque'
    },
    {
      id: 2,
      nom: 'Clavier Mécanique',
      prix: 89.99,
      quantite: 1,
      image: 'https://via.placeholder.com/100x100?text=Clavier'
    }
  ];

  carts = rxResource({
    stream: () => {
      return this.#cartService.getCarts()
        .pipe(
          map(response => response),
          tap(carts => console.log(carts))
        )
    }
  })
}
