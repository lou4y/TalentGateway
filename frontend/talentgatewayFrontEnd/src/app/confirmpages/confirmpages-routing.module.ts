import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmProfileDetailsComponent } from './confirmProfileDetails/confirm-profile-details.component';
import { VerificationComponent } from './verification/verification.component'; // Corrected path


const routes: Routes = [
  {
    path: 'confirm-profile-details',
    component: ConfirmProfileDetailsComponent
  },
  {
    path: 'confirmation', // Corrected path
    component: VerificationComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmpagesRoutingModule { }
