import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LabelResponseApi} from '../../model/label/label-response-api';

@Injectable({providedIn: 'root'})
export class LabelService {
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  getAllLabels():Observable<LabelResponseApi> {
    return this.#http.get<LabelResponseApi>(this.#API_URL + '/label');
  }
}
