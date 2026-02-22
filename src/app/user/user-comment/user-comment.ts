import {Component, EventEmitter, inject, input, InputSignal, Output} from '@angular/core';
import {ClientComment} from '../../model/client/client-comment';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../service/user/user-service';
import {CommentClientResponseApi} from '../../model/comment/comment-client-response-api';
import {ToasterService} from '../../service/toaster/toasterService';
import {CommentService} from '../../service/comment/commentService';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-user-comment',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './user-comment.html'
})
export class UserComment {

  userCommentsInput:InputSignal<ClientComment[] | undefined> = input.required<ClientComment[] | undefined>();
  readonly #userService = inject(UserService)
  private toasterService = inject(ToasterService);
  private commentService = inject(CommentService);
  readonly i18n = inject(I18nService);

  @Output() commentsUpdated = new EventEmitter<void>();

  readonly form = new FormGroup({
    header: new FormControl("",
      [
        Validators.required
      ]
    ),
    body: new FormControl("",
      [
        Validators.required
      ]
    )
  });

  get header(): FormControl {
    return this.form.get('header') as FormControl;
  }

  get body(): FormControl {
    return this.form.get('body') as FormControl;
  }

  onSubmit() {
    let commentClient:CommentClient = {
      "header":String(this.form.value.header),
      "body":String(this.form.value.body),
      "createAt": new Date().toISOString(),
      "updateAt": new Date().toISOString(),
    }

    this.#userService.addUserComment(commentClient).subscribe({
      next: (response: CommentClientResponseApi) => {
        if (response.responseCode === 200) {
          this.commentsUpdated.emit();
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation("SUCCESS"),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Commentaire ajouté avec success'
          })
        } else {
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation("ERROR"),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/error.png',
            toastMessage: 'Une erreur est survenue lors de l\'ajout du commentaire'
          })
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("ERROR"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/error.png',
          toastMessage: message
        })
      }
    });

  }

  deleteComment(CommentId: number) {
    this.commentService.deleteCommentById(CommentId).subscribe(() => {
      this.toasterService.show({
        toastTitle: this.i18n.getTranslation("SUCCESS"),
        toastTime: this.i18n.getTranslation("JUST_NOW"),
        toastImageUrl: '/fotova/check.jpg',
        toastMessage: "Commentaire supprimé avec success"
      })
      this.commentsUpdated.emit();
    })
  }
}
