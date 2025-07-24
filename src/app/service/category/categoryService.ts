import {inject, Injectable} from '@angular/core';
import {CategoryResponseApi} from '../../model/category/category-response-api';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  getAllCategories():Observable<CategoryResponseApi> {
    return this.#http.get<CategoryResponseApi>(this.#API_URL + '/category');
  }
}
