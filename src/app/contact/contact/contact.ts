import {Component, DestroyRef, inject, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, tap} from 'rxjs';
import {ContactService} from '../../service/contact/contactService';
import {ToasterService} from '../../service/toaster/toasterService';
import {ContactResponseApi} from '../../model/contact/contact-response-api';
import {I18nService} from '../../service/i18n/i18nService';


@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {

  private contactService = inject(ContactService);
  private toasterService = inject(ToasterService);
  readonly i18n = inject(I18nService);
  readonly #destroyRef = inject(DestroyRef);
  isLoading: WritableSignal<boolean> = signal(false);

  nomShowError = false;
  emailShowError = false;
  sujetShowError = false;
  messageShowError = false;

  constructor() {
    this.nom.valueChanges.pipe(
      tap(() => this.nomShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.nomShowError = true);

    this.email.valueChanges.pipe(
      tap(() => this.emailShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.emailShowError = true);

    this.sujet.valueChanges.pipe(
      tap(() => this.sujetShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.sujetShowError = true);

    this.message.valueChanges.pipe(
      tap(() => this.messageShowError = false),
      debounceTime(800),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => this.messageShowError = true);
  }

  readonly socialLinks = [
    { icon: 'bi-instagram', url: 'https://www.instagram.com/fotova', label: 'Instagram' },
    { icon: 'bi-facebook',  url: 'https://www.facebook.com/fotova',  label: 'Facebook' },
    { icon: 'bi-tiktok',    url: 'https://www.tiktok.com/@fotova',   label: 'TikTok' },
    { icon: 'bi-pinterest', url: 'https://www.pinterest.com/fotova', label: 'Pinterest' },
  ];

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
              toastMessage: this.i18n.getTranslation('EMAIL_SENT_SUCCESS'),
            })
          } else {
            this.toasterService.show({
              toastTitle: this.i18n.getTranslation('ERROR'),
              toastTime: this.i18n.getTranslation('JUST_NOW'),
              toastImageUrl: '/fotova/error.png',
              toastMessage: this.i18n.getTranslation('EMAIL_SENT_ERROR')
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
