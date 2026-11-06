// ClaimsModule is the entry point exposed to the host via Module Federation.
// The host loads this module lazily at runtime.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ClaimListComponent } from './claims/claim-list.component';
import { ClaimFormComponent } from './claims/claim-form.component';

const claimsRoutes: Routes = [
  // Default route shows the claims roster
  { path: '', component: ClaimListComponent },
  // Add-claim route shows the claim form
  { path: 'add-claim', component: ClaimFormComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(claimsRoutes),
    // Standalone components are imported directly
    ClaimListComponent,
    ClaimFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimsModule {}

