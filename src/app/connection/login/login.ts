import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
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

  get email() : FormControl {
    return this.form.get('email') as FormControl;
  }

  get password() : FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
