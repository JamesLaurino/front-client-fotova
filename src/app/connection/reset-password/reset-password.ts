import {Component, inject} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToasterService} from '../../service/toaster/toasterService';
import {Router} from '@angular/router';
import {ResetService} from '../../service/password/reset-service';
import {ResetApiInput} from '../../model/reset/reset-api-input';
import {ResetApiResponse} from '../../model/reset/reset-api-response';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  readonly i18n = inject(I18nService);
  readonly form= new FormGroup({
    email: new FormControl("",
      [
        Validators.required,
        Validators.email
      ]
    ),
    newPassword: new FormControl("",
      [
        Validators.required,
        Validators.minLength(4)
      ]
    )
  });

  protected resetService = inject(ResetService)
  toasterService = inject(ToasterService)
  readonly #router = inject(Router)

  get email() : FormControl {
    return this.form.get('email') as FormControl;
  }

  get newPassword() : FormControl {
    return this.form.get('newPassword') as FormControl;
  }

  goToLoginPage(): void {
    this.#router.navigate(['/login']);
  }

  showToast(message: string) {
    this.toasterService.show({
      toastMessage: message,
      toastTitle:"Une erreur est survenue",
      toastImageUrl :'/fotova/error.png',
      toastTime : 'il y a 1 min'
    });
  }

  onSubmit()
  {
    let resetApiInput:ResetApiInput = {
      "email":String(this.form.value.email),
      "newPassword":String(this.form.value.newPassword)
    }

    this.resetService.resetPassword(resetApiInput).subscribe({
      next: (response: ResetApiResponse) => {
        if (response.responseCode === 200) {
          this.toasterService.show({
            toastMessage: "Un email vient de vous être envoyé en vue de la modification de votre mot de passe",
            toastTitle:"Succès",
            toastImageUrl :'/fotova/check.jpg',
            toastTime : 'il y a 1 min'
          });
        } else {
          this.showToast(response.responseMessage || 'Erreur survenue');
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.showToast(message);
      }
    });
  }
}
