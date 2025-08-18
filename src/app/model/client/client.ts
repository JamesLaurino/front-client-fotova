import {ClientAddress} from './client-address';
import {ClientComment} from './client-comment';

export interface Client {
  "id":number,
  "username":string,
  "email":string,
  "isActive":boolean;
  "address":ClientAddress
  "roles":string[];
  "comments":ClientComment[];
}
