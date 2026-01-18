import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ProductService} from './service/interfaces/product-service';
import ProductFactory from './service/factory/product-factory';
import {CartService} from './service/interfaces/cart-service';
import CartFactory from './service/factory/cart-factory';
import {AuthInterceptor} from './service/interceptor/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:ProductService,
      useFactory:ProductFactory
    },
    {
      provide:CartService,
      useFactory:CartFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
