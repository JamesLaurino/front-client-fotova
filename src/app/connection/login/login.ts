import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginApiInput} from '../../model/login/login-api-input';
import {LoginService} from '../../service/login/login-service';
import {LoginApiResponse} from '../../model/login/login-api-response';
import {Router} from '@angular/router';
import {ToasterService} from '../../service/toaster/toasterService';
import {I18nService} from '../../service/i18n/i18nService';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login
{

  readonly i18n = inject(I18nService);
  readonly form= new FormGroup({
    email: new FormControl("",
      [
        Validators.required,
        Validators.email
      ]
    ),
    password: new FormControl("",
      [
        Validators.required,
        Validators.minLength(4)
      ]
    )
  });

  protected loginService = inject(LoginService)
  toasterService = inject(ToasterService)
  readonly #router = inject(Router)

  get email() : FormControl {
    return this.form.get('email') as FormControl;
  }

  get password() : FormControl {
    return this.form.get('password') as FormControl;
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
    let loginApiInput:LoginApiInput = {
      "email":String(this.form.value.email),
      "password":String(this.form.value.password)
    }

    this.loginService.login(loginApiInput).subscribe({
      next: (response: LoginApiResponse) => {
        if (response.responseCode === 200) {
          this.loginService.setValueToken(response.data.access_token)
          this.loginService.isLogged();
          this.#router.navigate(['/products']);
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

  goToRegister() {
    this.#router.navigate(['/register']);
  }
}
