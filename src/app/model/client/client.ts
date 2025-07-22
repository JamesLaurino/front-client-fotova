import {ClientAddress} from './client-address';
import {ClientRole} from './client-role';
import {ClientComment} from './client-comment';

export interface Client {
  "id":number,
  "username":string,
  "email":string,
  "isActive":boolean;
  "address":ClientAddress
  "roles":ClientRole;
  "comments":ClientComment[];
}
