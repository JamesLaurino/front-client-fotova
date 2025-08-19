import {inject, Injectable} from '@angular/core';
import {CategoryResponseApi} from '../../model/category/category-response-api';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CategoryResponseDetailApi} from '../../model/category/category-response-detail-api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  getAllCategories():Observable<CategoryResponseApi> {
    return this.#http.get<CategoryResponseApi>(this.#API_URL + '/category');
  }

  getCategoryById(id:number):Observable<CategoryResponseDetailApi> {
    return this.#http.get<CategoryResponseDetailApi>(this.#API_URL + '/category/' + id);
  }

  // TODO implémenter update catégorie
}
