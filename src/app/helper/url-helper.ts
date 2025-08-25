import {environment} from '../../environments/environment';

export default function urlHelper(url:string):string {
  let baseUrl = environment.baseUrl;
  if(url.startsWith('file:')) {
    return baseUrl + "/images/" + url.split('/').at(-1);
  } else {
    return baseUrl + "/images/" + url;
  }
}
