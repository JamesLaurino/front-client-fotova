import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ContactService} from '../../service/contact/contactService';
import {ToasterService} from '../../service/toaster/toasterService';
import {ContactResponseApi} from '../../model/contact/contact-response-api';
import {I18nService} from '../../service/i18n/i18nService';


@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html'
})
export class Contact {

  private contactService = inject(ContactService);
  private toasterService = inject(ToasterService);
  readonly i18n = inject(I18nService);
  isLoading:WritableSignal<boolean> = signal(false);

  readonly form = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    sujet: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ])
  });

  get nom(): FormControl {
    return this.form.get('nom') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get sujet(): FormControl {
    return this.form.get('sujet') as FormControl;
  }

  get message(): FormControl {
    return this.form.get('message') as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      const contactData: ContactModel = {
        nom: String(this.form.value.nom),
        email: String(this.form.value.email),
        sujet: String(this.form.value.sujet),
        message: String(this.form.value.message)
      };
      console.log('Contact form submitted:', contactData);
      this.contactService.sendEmail(contactData).subscribe({
        next: (response: ContactResponseApi) => {
          this.isLoading.set(false);
          if (response.responseCode === 200) {
            this.toasterService.show({
              toastTitle: this.i18n.getTranslation('SUCCESS'),
              toastTime: this.i18n.getTranslation('JUST_NOW'),
              toastImageUrl: '/fotova/check.jpg',
              toastMessage: 'Votre mail a été ajouté avec success'
            })
          } else {
            this.toasterService.show({
              toastTitle: this.i18n.getTranslation('ERROR'),
              toastTime: this.i18n.getTranslation('JUST_NOW'),
              toastImageUrl: '/fotova/error.png',
              toastMessage: 'Une erreur est survenue lors de l\'envoie de du mail'
            })
          }
        },
        error: (error: any) => {
          const message = error.error.errorList[0]
          this.toasterService.show({
            toastTitle: this.i18n.getTranslation('ERROR'),
            toastTime: this.i18n.getTranslation('JUST_NOW'),
            toastImageUrl: '/fotova/error.png',
            toastMessage: message
          })
        }
      });
    }
  }
}
