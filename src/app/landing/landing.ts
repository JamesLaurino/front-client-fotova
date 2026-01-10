import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {CommentService} from '../service/comment/commentService';
import {I18nService} from '../service/i18n/i18nService';

@Component({
  selector: 'app-landing',
  imports: [
    DatePipe
  ],
  templateUrl: './landing.html',
  styles: [`
    .parallax {
      background-image: url('/fotova/parallax.png');
      min-height: 500px;
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  `]
})
export class Landing {

  private commentService = inject(CommentService)
  readonly #router = inject(Router)
  readonly i18n = inject(I18nService);

  comments = rxResource({
    stream: () => {
      return this.commentService.getAllComments()
        .pipe(
          map(response => response.data)
        )
    }
  })

  goToProduct() {
    this.#router.navigate(['/products']);
  }

  goToContactPage() {
    this.#router.navigate(['/contact']);
  }
}
