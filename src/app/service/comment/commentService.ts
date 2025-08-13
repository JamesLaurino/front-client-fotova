import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommentResponseApi} from '../../model/comment/comment-response-api';
import {CommentResponseDeleteApi} from '../../model/comment/comment-response-delete-api';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  getAllComments():Observable<CommentResponseApi> {
    return this.#http.get<CommentResponseApi>(this.#API_URL + '/comments');
  }

  deleteCommentById(id:number):Observable<CommentResponseDeleteApi> {
    return this.#http.delete<CommentResponseDeleteApi>(this.#API_URL + '/comment/' + id + '/delete');
  }
}
