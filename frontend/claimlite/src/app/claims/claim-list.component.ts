import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Claim, ClaimService } from './claim.service';

@Component({
  selector: 'app-claim-list',
  imports: [DatePipe],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimListComponent implements OnInit {

  claims: Claim[] = [];
  loading = false;

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;

    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load claims', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addClaim(): void {
    this.router.navigate(['/add-claim']);
  }
}