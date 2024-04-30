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
import {InternshipsComponent} from "./FrontOffice/internships/internships.component";
import {InternshipsDetailComponent} from "./FrontOffice/internships-detail/internships-detail.component";
import { KanbanboardComponent } from './FrontOffice/kanbanboard/kanbanboard.component';


const routes: Routes = [

  {path: 'listprojectsfrontoffice', component: ListprojectsComponent },
  { path: 'listprojectsfrontoffice', component: ListprojectsComponent },
  { path: 'Internships', component: InternshipsComponent },
  {path: 'detailProject/:id', component: DetailProjectComponent},
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard,UserVerificationGuard] },
  {path :'confirmation',component: VerificationComponent,canActivate: [AuthGuard]},
  { path: 'confirm-profile-details', component:ConfirmProfileDetailsComponent, canActivate: [AuthGuard]},
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard,UserVerificationGuard] },
  {path: 'internshipslist', component: InternshipsComponent , canActivate: [AuthGuard]},
  {path: 'details/:id', component: InternshipsDetailComponent, canActivate: [AuthGuard] },
  {path: 'boardtask', component: KanbanboardComponent , canActivate: [AuthGuard]},

  // tslint:disable-next-line: max-line-length
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  { path: '**', component: Page404Component }

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
