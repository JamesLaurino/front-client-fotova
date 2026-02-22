import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResetApiInput} from '../../model/reset/reset-api-input';
import {ResetApiResponse} from '../../model/reset/reset-api-response';

@Injectable({providedIn: 'root'})
export class ResetService {
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  resetPassword(resetApiInput:ResetApiInput): Observable<ResetApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.#http.post<ResetApiResponse>(this.#API_URL + '/password-reset/email', resetApiInput,{ headers });
  }
}
