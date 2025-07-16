import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {ProductService} from './service/interfaces/product-service';
import ProductFactory from './service/factory/product-factory';
import {CartService} from './service/interfaces/cart-service';
import CartFactory from './service/factory/cart-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide:ProductService,
      useFactory:ProductFactory
    },
    {
      provide:CartService,
      useFactory:CartFactory
    }
  ]
};
