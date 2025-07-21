import {computed, Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoginHelper {

  public logged = signal(false);

  public isLogged = computed(() => {
    return this.logged();
  })
}
