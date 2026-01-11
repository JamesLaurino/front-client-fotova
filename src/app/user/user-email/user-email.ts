import { Component, InputSignal, input, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {I18nService} from '../../service/i18n/i18nService';
import {ClientEmail} from '../../model/client/client-email';


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

    console.log('ClientEmail payload:', emailPayload);

    // Exemple :
    // this.emailService.sendEmail(emailPayload).subscribe(...)
  }
}
