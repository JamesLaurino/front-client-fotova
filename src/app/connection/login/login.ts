import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginApiInput} from '../../model/login/login-api-input';
import {LoginService} from '../../service/login/login-service';
import {LoginApiResponse} from '../../model/login/login-api-response';
import {Router} from '@angular/router';

declare var bootstrap: any;

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

  @ViewChild('toastElement') toastElement!: ElementRef;
  private toastInstance: any;

  protected loginService = inject(LoginService)
  readonly #router = inject(Router)

  get email() : FormControl {
    return this.form.get('email') as FormControl;
  }

  get password() : FormControl {
    return this.form.get('password') as FormControl;
  }

  showToast(message: string) {
    this.toastElement.nativeElement.querySelector('.toast-body').textContent = message;
    this.toastInstance = new bootstrap.Toast(this.toastElement.nativeElement);
    this.toastInstance.show();
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
