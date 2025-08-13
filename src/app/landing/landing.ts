import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {CommentService} from '../service/comment/commentService';

@Component({
  selector: 'app-landing',
  imports: [
    DatePipe
  ],
  templateUrl: './landing.html',
  styles: ''
})
export class Landing {

  private commentService = inject(CommentService)
  readonly #router = inject(Router)

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
