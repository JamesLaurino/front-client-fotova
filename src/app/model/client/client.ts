import {ClientAddress} from './client-address';
import {ClientRole} from './client-role';

export interface Client {
  "id":number,
  "username":string,
  "email":string,
  "isActive":boolean;
  "ClientAddressDto":ClientAddress
  "roles":ClientRole;
}
