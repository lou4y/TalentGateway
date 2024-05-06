import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmProfileDetailsComponent } from './confirmProfileDetails/confirm-profile-details.component';
import { VerificationComponent } from './verification/verification.component'; // Corrected path

import { ConfirmationComponent } from './confirmation/confirmation.component';

const routes: Routes = [
  {
    path: 'confirm-profile-details',
    component: ConfirmProfileDetailsComponent
  },
  {
    path: 'confirmation', // Corrected path
    component: VerificationComponent
  },
  {
    path: 'confirmation1', // Corrected path
    component: ConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmpagesRoutingModule { }
