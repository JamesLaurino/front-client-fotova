import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBar} from './share/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
  templateUrl: './app.html',
  styles: ''
})
export class App {
  protected title = 'front-client-fotova';
}
