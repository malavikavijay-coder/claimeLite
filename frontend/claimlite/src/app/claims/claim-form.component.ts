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
import { ClaimService } from './claim.service';
import { UserService, User } from '../users/user.service';

@Component({
  selector: 'app-claim-form',

  imports: [ReactiveFormsModule],

  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimFormComponent {

  loading = false;
  loadingUsers = false;
  successMessage = '';

  users: User[] = [];

  claimForm: any;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.claimForm = this.fb.group({

      userId: [
        '',
        [
          Validators.required
        ]
      ],

      claimType: [
        '',
        [
          Validators.required
        ]
      ],

      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(1000000)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ]

    });

    this.loadUsers();
  }

  loadUsers(): void {

    this.loadingUsers = true;

    this.userService.getUsers().subscribe({

      next: (users) => {

        this.users = users;

        this.loadingUsers = false;

        this.cdr.markForCheck();

      },

      error: (error) => {

        console.error('Unable to load users', error);

        this.loadingUsers = false;

        this.cdr.markForCheck();

      }

    });
  }

  submit(): void {

    if (this.claimForm.invalid) {
      return;
    }

    this.loading = true;

    const claim = {

      userId: this.claimForm.value.userId!,

      claimType: this.claimForm.value.claimType!,

      amount: Number(this.claimForm.value.amount),

      description: this.claimForm.value.description!

    };

    this.claimService.createClaim(claim).subscribe({

      next: () => {

        this.loading = false;

        this.claimForm.reset();

        this.successMessage = 'Claim saved successfully!';

        this.cdr.markForCheck();

        setTimeout(() => {

          this.successMessage = '';

          this.cdr.markForCheck();

          this.router.navigate(['/claims']);

        }, 3000);

      },

      error: (error) => {

        console.error('Unable to create claim', error);

        this.loading = false;

        this.cdr.markForCheck();

      }

    });
  }

  cancel(): void {

    this.router.navigate(['/claims']);

  }
}