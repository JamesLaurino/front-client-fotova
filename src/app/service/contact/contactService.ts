import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ContactResponseApi} from '../../model/contact/contact-response-api';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  sendEmail(contactMessage:ContactModel):Observable<ContactResponseApi> {
    return this.#http.post<ContactResponseApi>(this.#API_URL + '/amq/contact',contactMessage);
  }
}
