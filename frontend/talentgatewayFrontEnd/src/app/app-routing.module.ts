import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { UserVerificationGuard } from './core/guards/user-verification.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { ListprojectsComponent } from './FrontOffice/listprojects/listprojects.component';
import { DetailProjectComponent } from './FrontOffice/projects/detail-project/detail-project.component';
import {VerificationComponent} from "./confirmpages/verification/verification.component";
import {ConfirmProfileDetailsComponent} from "./confirmpages/confirmProfileDetails/confirm-profile-details.component";

const routes: Routes = [

  {path: 'listprojectsfrontoffice', component: ListprojectsComponent },
  {path: 'detailProject/:id', component: DetailProjectComponent},
  // tslint:disable-next-line: max-line-length

  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard,UserVerificationGuard] },
  {path :'confirmation',component: VerificationComponent,canActivate: [AuthGuard]},
  { path: 'confirm-profile-details', component:ConfirmProfileDetailsComponent, canActivate: [AuthGuard]},
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard,UserVerificationGuard] },
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
