import {
  Component,
  ElementRef, EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit, Output,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ClientAddress} from '../../model/client/client-address';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../service/user/user-service';
import {ToasterModel} from '../../model/toaster/toaster-model';

declare var bootstrap: any;

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './user-edit.html',
  styleUrls: []
})
export class UserEdit implements OnInit
{
  userAddressInput:InputSignal<ClientAddress | undefined> = input.required<ClientAddress | undefined>();
  readonly #userService = inject(UserService);

  @ViewChild('toastElement') toastElement!: ElementRef;
  private toastInstance: any;

  @Output() addressUpdated = new EventEmitter<void>();

  protected toasterMessage:WritableSignal<ToasterModel> = signal({
    toastTitle: 'Succès',
    toastTime: 'Just now',
    toastImageUrl: '/fotova/check.jpg',
    toastMessage: 'Mise à jour effectuée avec succès.'
  });

  form= new FormGroup({
    street: new FormControl('',
      [
        Validators.required,
      ]
    ),
    city: new FormControl('',
      [
        Validators.required,
      ]
    ),
    number: new FormControl('',
      [
        Validators.required,
      ]
    ),
    country: new FormControl('',
      [
        Validators.required,
      ]
    )
  });

  ngOnInit(): void {
    const address = this.userAddressInput();
    if (address) {
      this.form.patchValue({
        street: address.street,
        city: address.city,
        number: String(address.number),
        country: address.country
      });
    }
  }

  get street():FormControl {
    return this.form.get('street') as FormControl;
  }

  get number():FormControl {
    return this.form.get('number') as FormControl;
  }

  get country():FormControl {
    return this.form.get('country') as FormControl;
  }

  get city():FormControl {
    return this.form.get('city') as FormControl;
  }

  onSubmit()
  {
    const address:Omit<ClientAddress, 'id'> = {
      street:this.street.value,
      city:this.city.value,
      number:this.number.value,
      country:this.country.value
    }

    this.#userService.updateAddressInformation(address).subscribe({
      next: (response) =>
      {
        this.addressUpdated.emit();
        this.toastInstance = new bootstrap.Toast(this.toastElement.nativeElement);
        this.toastInstance.show();
      },
      error: (error) => {
        this.toasterMessage.set({
          toastTitle: 'Error',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          toastMessage: 'La mise à jour échouée.'
        });
        this.toastInstance = new bootstrap.Toast(this.toastElement.nativeElement);
        this.toastInstance.show();
      }
    });
  }
}
