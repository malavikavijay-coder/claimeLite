
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserFormComponent implements OnInit {

  loading = false;
  successMessage = '';
  userId: string | null = null;

  userForm: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.loadUser();
    }

  }

  loadUser(): void {

    this.loading = true;

    this.userService.getUserById(this.userId!).subscribe({

      next: (user) => {

        this.userForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        });

        this.loading = false;
        this.cdr.markForCheck();

      },

      error: (error) => {

        console.error('Unable to load user', error);

        this.loading = false;
        this.cdr.markForCheck();

        window.alert('Unable to load policyholder details.');

        this.router.navigate(['/users']);

      }

    });

  }

  submit(): void {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const user = {
      fullName: this.userForm.value.fullName!,
      email: this.userForm.value.email!,
      phone: this.userForm.value.phone!
    };

    if (this.userId) {

      // Update existing policyholder
      this.userService.updateUser(this.userId, user).subscribe({

        next: () => {

          this.loading = false;

          window.alert('Policyholder updated successfully!');

          this.cdr.markForCheck();

          this.router.navigate(['/users']);

        },

        error: (error) => {

          console.error('Unable to update user', error);

          this.loading = false;

          window.alert(
            error.error?.message || 'Unable to update policyholder'
          );

          this.cdr.markForCheck();

        }

      });

    } else {

      // Create new policyholder
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

          window.alert(
            error.error?.message || 'Unable to create user'
          );

          this.cdr.markForCheck();

        }

      });

    }

  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

}
