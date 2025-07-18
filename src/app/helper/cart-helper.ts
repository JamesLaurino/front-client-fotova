import {computed, Injectable, signal, Signal, WritableSignal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CartHelper {

  public cartsQuantity = signal(0);

  public cartsQuantityComputed = computed(() => {
    return this.cartsQuantity();
  })
}
