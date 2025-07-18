import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styles: ''
})
export class Login {

}

/**
 *
 * input LOGIN
 *
 * {"email": "koba@hotmail.com","password": "1234"}
 *
 * RESPONSE FROM LOGIN
 *
 * {
 *   "responseCode": 200,
 *   "responseMessage": "SUCCESS",
 *   "data": {
 *     "username": "koba@hotmail.com",
 *     "email": "koba@hotmail.com",
 *     "roles": [
 *       "ROLE_ADMIN"
 *     ],
 *     "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrb2JhQGhvdG1haWwuY29tIiwiaWF0IjoxNzUyODczMzI5LCJleHAiOjE3NTI4NzQyMjl9.3hTO6gsNODGiYxhOYZjG7MMoF5p-ap-rupZfca4-U4s",
 *     "token_type": "Bearer"
 *   }
 * }
 *
 *
 */
