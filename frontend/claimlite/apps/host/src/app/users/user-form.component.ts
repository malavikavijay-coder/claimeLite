import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-form',

  imports: [ReactiveFormsModule],

  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserFormComponent {

  loading = false;
  successMessage = '';

  userForm: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.userForm = this.fb.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/)
        ]
      ]

    });
  }

  submit(): void {

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    const user = {
      fullName: this.userForm.value.fullName!,
      email: this.userForm.value.email!,
      phone: this.userForm.value.phone!
    };

    this.userService.createUser(user).subscribe({

      next: () => {

        this.loading = false;

        this.userForm.reset();

        this.successMessage = 'User saved successfully!';

        this.cdr.markForCheck();


        setTimeout(() => {

          this.successMessage = '';

          this.cdr.markForCheck();

        }, 3000);

      },
      

      error: (error) => {

        console.error('Unable to create user', error);

        this.loading = false;

        this.cdr.markForCheck();

      }

    });
  }
  cancel(): void {
    this.router.navigate(['/users']);}
}