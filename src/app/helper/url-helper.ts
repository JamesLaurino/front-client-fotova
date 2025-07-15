import {environment} from '../../environments/environment';

export default function urlHelper(url:string):string {
  let baseUrl = environment.baseUrl;
  let urlSplit = url.split('/')[12] + '/' + url.split('/')[13];
  return baseUrl + "/" + urlSplit;
}
