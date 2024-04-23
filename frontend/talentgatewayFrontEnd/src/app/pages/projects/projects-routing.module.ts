import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectgridComponent } from './projectgrid/projectgrid.component';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { ListprojectsComponent } from 'src/app/FrontOffice/listprojects/listprojects.component';

const routes: Routes = [
    {
        path: 'grid',
        component: ProjectgridComponent
    },
    {
        path: 'list',
        component: ProjectlistComponent
    },
    {
        path: 'overview',
        component: OverviewComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'updateProject/:id',
        component: UpdateProjectComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {}
