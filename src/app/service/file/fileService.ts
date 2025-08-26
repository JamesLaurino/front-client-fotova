import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ImageDeleteApiResponse} from '../../model/file/image-delete-api-response';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  readonly #API_URL = environment.apiUrl;
  readonly #http:HttpClient = inject(HttpClient)

  uploadFile(file:FormData):Observable<FileApiResponse> {
    return this.#http.post<FileApiResponse>(this.#API_URL + '/file/upload', file);
  }

  linkImageToProduct(productId:number,imageName:string):Observable<FileApiResponse> {
    return this.#http.post<FileApiResponse>(this.#API_URL + '/image/add/' + productId, {path:imageName});
  }

  removeImageGallery(imageName:string,productId:number):Observable<ImageDeleteApiResponse> {
    return this.#http.delete<ImageDeleteApiResponse>(this.#API_URL + '/image/delete/' + imageName + '/' + productId);
  }
}
