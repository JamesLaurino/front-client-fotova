import {Component, inject, input, InputSignal} from '@angular/core';
import {ClientComment} from '../../model/client/client-comment';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../service/user/user-service';
import {CommentClientResponseApi} from '../../model/comment/comment-client-response-api';
import {ToasterService} from '../../service/toaster/toasterService';

@Component({
  selector: 'app-user-comment',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './user-comment.html',
  styleUrl: './user-comment.css'
})
export class UserComment {

  userCommentsInput:InputSignal<ClientComment[] | undefined> = input.required<ClientComment[] | undefined>();
  readonly #userService = inject(UserService)
  private toasterService = inject(ToasterService);

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
          this.toasterService.show({
            toastTitle: 'Comments success',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Commentaire ajouté avec success'
          })
          window.location.reload();
        } else {
          this.toasterService.show({
            toastTitle: 'Comments error',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/error.png',
            toastMessage: 'Une erreur est survenue lors de l\'ajout du commentaire'
          })
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.toasterService.show({
          toastTitle: 'Comments error',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/error.png',
          toastMessage: message
        })
      }
    });

  }
}
