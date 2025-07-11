import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBar} from './share/nav-bar/nav-bar';
import {Footer} from './share/footer/footer';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet, Footer],
  templateUrl: './app.html',
  styles: ''
})
export class App {
  protected title = 'front-client-fotova';
}
