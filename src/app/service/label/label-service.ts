import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LabelResponseApi} from '../../model/label/label-response-api';
import {LabelResponseUpdateApi} from '../../model/label/label-response-update-api';
import {LabelModel} from '../../model/label/label-model';
import {LabelResponseProductIdApi} from '../../model/label/label-response-product-id-api';

@Injectable({providedIn: 'root'})
export class LabelService {
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  getAllLabels():Observable<LabelResponseApi> {
    return this.#http.get<LabelResponseApi>(this.#API_URL + '/label');
  }

  getLabelByProductId(productId:number):Observable<LabelResponseProductIdApi> {
    return this.#http.get<LabelResponseProductIdApi>(this.#API_URL + '/label/productId/' + productId);
  }

  updateLabel(labelModel:LabelModel):Observable<LabelResponseUpdateApi> {
    return this.#http.put<LabelResponseUpdateApi>(this.#API_URL + '/add/label',labelModel);
  }
}
