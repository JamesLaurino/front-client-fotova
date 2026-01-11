import {Component, InputSignal, input, inject, Output, EventEmitter} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {I18nService} from '../../service/i18n/i18nService';
import {ClientEmail} from '../../model/client/client-email';
import {UserService} from '../../service/user/user-service';
import {ToasterService} from '../../service/toaster/toasterService';
import {ClientResponseEmailApi} from '../../model/client/client-response-email-api';


@Component({
  selector: 'app-user-email',
  templateUrl: './user-email.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./user-email.css']
})
export class UserEmail {

  userEmailInput: InputSignal<string | undefined> = input.required<string | undefined>();
  @Output() emailUpdated = new EventEmitter<void>();

  readonly #userService = inject(UserService)
  private toasterService = inject(ToasterService);
  readonly i18n = inject(I18nService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    sujet: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    if (this.userEmailInput()) {
      this.form.patchValue({
        nom: this.userEmailInput()
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const emailPayload: ClientEmail = {
      nom: this.form.value.nom!,
      email: this.form.value.email!,
      sujet: this.form.value.sujet!,
      message: this.form.value.message!
    };

    // sending email to server
    this.#userService.sendEmail(emailPayload).subscribe({
      next: (response: ClientResponseEmailApi) => {
        if (response.responseCode === 200) {
          this.emailUpdated.emit();
          this.toasterService.show({
            toastTitle: 'Mail success',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Email send with success'
          })
        } else {
          this.toasterService.show({
            toastTitle: 'Mail error',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/error.png',
            toastMessage: 'Une erreur est survenue lors de l\'envoie du mail veuillez tenter plus tard'
          })
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.toasterService.show({
          toastTitle: 'Mail error',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/error.png',
          toastMessage: message
        })
      }
    });
  }
}
