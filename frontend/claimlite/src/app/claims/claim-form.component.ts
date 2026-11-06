
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
import { ClaimService } from './claim.service';
import { UserService, User } from '../users/user.service';

@Component({
  selector: 'app-claim-form',
  imports: [ReactiveFormsModule],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimFormComponent implements OnInit {

  loading = false;
  analyzing = false;
  loadingUsers = false;
  successMessage = '';
  analysisError = '';
  aiRiskScore: number | null = null;

  users: User[] = [];

  claimId: string | null = null;

  claimForm: any;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

    this.claimForm = this.fb.group({

      userId: [
        '',
        [Validators.required]
      ],

      claimType: [
        '',
        [Validators.required]
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

  ngOnInit(): void {

    this.claimId = this.route.snapshot.paramMap.get('id');

    if (this.claimId) {
      this.loadClaim();
    }

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

  loadClaim(): void {

    if (!this.claimId) {
      return;
    }

    this.loading = true;

    this.claimService.getClaimById(this.claimId).subscribe({

      next: (claim) => {

        this.claimForm.patchValue({

          userId: claim.userId._id,
          claimType: claim.claimType,
          amount: claim.amount,
          description: claim.description

        });

        this.loading = false;

        this.cdr.markForCheck();

      },

      error: (error) => {

        console.error('Unable to load claim', error);

        this.loading = false;

        window.alert('Unable to load claim details.');

        this.router.navigate(['/claims']);

        this.cdr.markForCheck();

      }

    });

  }

  submit(): void {

    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const claim = {

      claimType: this.claimForm.value.claimType,

      amount: Number(this.claimForm.value.amount),

      description: this.claimForm.value.description

    };

    if (this.claimId) {

      this.claimService.updateClaim(this.claimId, claim).subscribe({

        next: () => {

          window.alert('Claim updated successfully!');

          this.loading = false;

          this.cdr.markForCheck();

          this.router.navigate(['/claims']);

        },

        error: (error) => {

          console.error('Unable to update claim', error);

          window.alert(
            error.error?.message || 'Unable to update claim'
          );

          this.loading = false;

          this.cdr.markForCheck();

        }

      });

    } else {

      this.claimService.createClaim({

        userId: this.claimForm.value.userId,

        ...claim

      }).subscribe({

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

          window.alert(
            error.error?.message || 'Unable to create claim'
          );

          this.cdr.markForCheck();

        }

      });

    }

  }

  analyzeClaim(): void {
    const description = this.claimForm.controls.description.value?.trim();

    if (!description || description.length < 10 || description.length > 500) {
      this.claimForm.controls.description.markAsTouched();
      return;
    }

    this.analyzing = true;
    this.analysisError = '';
    this.aiRiskScore = null;

    this.claimService.analyzeClaim(description).subscribe({
      next: (analysis) => {
        this.claimForm.controls.claimType.setValue(analysis.claimType);
        this.aiRiskScore = analysis.riskScore;
        this.analyzing = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to analyze claim', error);
        this.analysisError = error.error?.message || 'Unable to analyze claim. Please try again.';
        this.analyzing = false;
        this.cdr.markForCheck();
      }
    });
  }

  clearAnalysis(): void {
    this.aiRiskScore = null;
    this.analysisError = '';
  }

  getPolicyholderName(): string {

  const user = this.users.find(
    u => u._id === this.claimForm.controls.userId.value
  );

  return user?.fullName || '';

}

getPolicyholderEmail(): string {

  const user = this.users.find(
    u => u._id === this.claimForm.controls.userId.value
  );

  return user?.email || '';

}

  cancel(): void {

    this.router.navigate(['/claims']);

  }

}
