import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RegisterApiInput} from '../../model/register/register-api-input';
import {RegisterApiResponse} from '../../model/register/register-api-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient);

  registerUser(registerUserInput:RegisterApiInput):Observable<RegisterApiResponse> {
    return this.#http.post<RegisterApiResponse>(this.#API_URL + '/register', registerUserInput);
  }
}
