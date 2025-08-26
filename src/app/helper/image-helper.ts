import {environment} from '../../environments/environment';

export default function imageHelper(url:string):string {
    return String(url.split('/').at(-1));
}
