import { Component } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    DatePipe
  ],
  templateUrl: './footer.html',
  styles: ''
})
export class Footer {
  getDate() {
     return new Date();
   }
}
