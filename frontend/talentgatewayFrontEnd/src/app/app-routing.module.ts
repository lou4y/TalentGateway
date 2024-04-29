import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { ListprojectsComponent } from './FrontOffice/listprojects/listprojects.component';
import { DetailProjectComponent } from './FrontOffice/projects/detail-project/detail-project.component';
import {InternshipsComponent} from "./FrontOffice/internships/internships.component";

import {InternshipsDetailComponent} from "./FrontOffice/internships-detail/internships-detail.component";

<<<<<<< HEAD
//import {InternshipsDetailsComponent} from "./FrontOffice/internships-details/internships-details.component";
=======
>>>>>>> 0a4f26ad1219a34fc0f0e0b0cfbca98c12c03589


const routes: Routes = [

  { path: 'listprojectsfrontoffice', component: ListprojectsComponent },
  { path: 'Internships', component: InternshipsComponent },
  {path: 'detailProject/:id', component: DetailProjectComponent},

  {path: 'internshipslist', component: InternshipsComponent , canActivate: [AuthGuard]},
  {path: 'details/:id', component: InternshipsDetailComponent, canActivate: [AuthGuard] },


  // tslint:disable-next-line: max-line-length
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  { path: '**', component: Page404Component },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
