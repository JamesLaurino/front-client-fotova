import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {UserService} from '../../service/user/user-service';
import {I18nService} from '../../service/i18n/i18nService';
import {DatePipe, NgClass} from '@angular/common';
import {ToasterService} from '../../service/toaster/toasterService';
import {CommentService} from '../../service/comment/commentService';

@Component({
  selector: 'app-admin-client-detail',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './admin-client-detail.html'
})
export class AdminClientDetail {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private idClient = Number(this.route.snapshot.params['id']);
  readonly #userService = inject(UserService);
  readonly i18n = inject(I18nService);
  private toasterService = inject(ToasterService);
  private commentService = inject(CommentService);

  clientDetail = rxResource({
    stream: () => {
      return this.#userService.getClientById(this.idClient)
        .pipe(
          map(response => response.data),
          tap(client => console.log(client))
        )
    }
  })

  deleteComment(id: number) {
    if (confirm("Are you sure to delete the comment ?")) {
      this.commentService.deleteCommentById(id).subscribe(() => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation('SUCCESS'),
          toastTime: this.i18n.getTranslation('JUST_NOW'),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: "Commentaire supprimé avec success"
        })
        this.clientDetail.reload();
      })
    }
  }

  deleteClient() {

    if (confirm("Are you sure to delete the client ?")) {
      this.#userService.deleteClientById(this.idClient).subscribe(() => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation('SUCCESS'),
          toastTime: this.i18n.getTranslation('JUST_NOW'),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: "Client supprimé avec success"
        })
        this.router.navigate(['/admin']);
      })
    }
  }

  backToPanel() {
    this.router.navigate(['/admin'],{queryParams:{active:'clients'}});
  }
}
