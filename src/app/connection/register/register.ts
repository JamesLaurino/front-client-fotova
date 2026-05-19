import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, tap} from 'rxjs';
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
  readonly #destroyRef = inject(DestroyRef);
  emailShowError = false;
  passwordShowError = false;

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

  constructor() {
    this.email.valueChanges.pipe(
      tap(() => this.emailShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.emailShowError = true);

    this.password.valueChanges.pipe(
      tap(() => this.passwordShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.passwordShowError = true);
  }

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
            toastTitle: this.i18n.getTranslation('SUCCESS'),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: this.i18n.getTranslation('ACCOUNT_VALIDATION_EMAIL_SENT'),
          });
            this.#router.navigate(['/login']);
        } else {
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation("ERROR"),
            toastTime: this.i18n.getTranslation("JUST_NOW"),
            toastImageUrl: '/fotova/error.png',
            toastMessage: this.i18n.getTranslation('REGISTRATION_ERROR'),
          });
        }
      },
      error: (error: any) => {
        const message = error.error.errorList[0]
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("ERROR"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/error.png',
          toastMessage: this.i18n.getTranslation('REGISTRATION_ERROR'),
        });
      }
    });
  }

  goToLogin() {
    this.#router.navigate(['/login']);
  }
}
