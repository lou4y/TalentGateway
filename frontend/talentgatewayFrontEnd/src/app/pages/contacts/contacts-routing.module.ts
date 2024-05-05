import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserlistComponent } from './userlist/userlist.component';
import { UsergridComponent } from './usergrid/usergrid.component';
import { ProfileComponent } from './profile/profile.component';
import {ProfileSettingsComponent} from "./profile-settings/profile-settings.component";

const routes: Routes = [
    {
        path: 'list',
        component: UserlistComponent
    },
    {
        path: 'grid',
        component: UsergridComponent
    },
    {
        path: 'view',
        component: ProfileComponent
    },
    {
      path: 'Settings',
      component: ProfileSettingsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
