import {ClientAddress} from './client-address';
import {ClientComment} from './client-comment';

export interface ClientAll {
  "id":number,
  "username":string,
  "email":string,
  "isActive":boolean;
  "address":ClientAddress
  "roles":string[];
  "commentEntities":ClientComment[];
}
