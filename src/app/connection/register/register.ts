import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../../service/register/RegisterService';
import {RegisterApiInput} from '../../model/register/register-api-input';
import {RegisterApiResponse} from '../../model/register/register-api-response';
import {ToasterService} from '../../service/toaster/toasterService';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  readonly i18n = inject(I18nService);
  readonly form= new FormGroup({
    email: new FormControl("",
      [
        Validators.required,
        Validators.email
      ]
    ),
    username: new FormControl("",
      [
        Validators.required,
        Validators.minLength(4)
      ]
    ),
    password: new FormControl("",
      [
        Validators.required,
        Validators.minLength(4)
      ]
    )
  });

  protected registerService = inject(RegisterService);
  protected toasterService = inject(ToasterService);
  readonly #router = inject(Router)

  get email() : FormControl {
    return this.form.get('email') as FormControl;
  }

  get password() : FormControl {
    return this.form.get('password') as FormControl;
  }

  get username() : FormControl {
    return this.form.get('username') as FormControl;
  }

  onSubmit()
  {
    let registerApiInput:RegisterApiInput = {
      "username":String(this.form.value.username),
      "email":String(this.form.value.email),
      "password":String(this.form.value.password)
    }

    this.registerService.registerUser(registerApiInput).subscribe({
      next: (response: RegisterApiResponse) => {
        if (response.responseCode === 200) {
          this.toasterService.show({
            toastTitle: 'Success',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: "Un email vous a été envoyé pour valider votre compte."
          });
            this.#router.navigate(['/login']);
        } else {
          this.toasterService.show({
            toastTitle: 'Error',
            toastTime: 'il y a 1 min',
            toastImageUrl: '/fotova/error.png',
            toastMessage: "Une erreur s'est produite lors de l'inscription."
          });
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.toasterService.show({
          toastTitle: 'Error',
          toastTime: 'il y a 1 min',
          toastImageUrl: '/fotova/error.png',
          toastMessage: "Une erreur s'est produite lors de l'inscription : " + message
        });
      }
    });
  }

  goToLogin() {
    this.#router.navigate(['/login']);
  }
}
