import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { Lockscreen2Component } from './lockscreen2/lockscreen2.component';
import { ConfirmProfileDetailsComponent } from './confirmProfileDetails/confirm-profile-details.component';
import { Confirmmail2Component } from './confirmmail2/confirmmail2.component';
import { VerificationComponent } from './Confirmation/verification.component';
import { Verification2Component } from './verification2/verification2.component';
import { SteptwoverificationComponent } from './steptwoverification/steptwoverification.component';
import { Steptwoverification2Component } from './steptwoverification2/steptwoverification2.component';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';

const routes: Routes = [
    {
        path: 'maintenance',
        component: MaintenanceComponent
    },
    {
        path: 'coming-soon',
        component: ComingsoonComponent
    },
    {
        path: '404',
        component: Page404Component
    },
    {
        path: '500',
        component: Page500Component
    },
    {
        path: 'lock-screen-1',
        component: LockscreenComponent
    },
    {
        path: 'lock-screen-2',
        component: Lockscreen2Component
    },
    {
        path: 'confirm-profile-details',
        component: ConfirmProfileDetailsComponent
    },
    {
        path: 'confirm-mail-2',
        component: Confirmmail2Component
    },
    {
        path: 'Confirmation',
        component: VerificationComponent
    },
    {
        path: 'email-Confirmation-2',
        component: Verification2Component
    },
    {
        path: 'two-step-Confirmation',
        component: SteptwoverificationComponent
    },
    {
        path: 'two-step-Confirmation-2',
        component: Steptwoverification2Component
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ExtrapagesRoutingModule { }
