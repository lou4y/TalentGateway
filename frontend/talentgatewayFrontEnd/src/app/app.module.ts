import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';
import { ExtrapagesModule } from './extrapages/extrapages.module';
import {ConfirmpagesModule} from './confirmpages/confirmpages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeKeycloak } from './authUtils';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { ListprojectsComponent } from './FrontOffice/listprojects/listprojects.component';
import { DetailProjectComponent } from './FrontOffice/projects/detail-project/detail-project.component';
import { CommentsComponent } from './FrontOffice/projects/comments/comments.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {InternshipsDetailComponent} from "./FrontOffice/internships-detail/internships-detail.component";
import {InternshipsComponent} from "./FrontOffice/internships/internships.component";
import {FooterFrontComponent} from "./FrontOffice/footer-front/footer-front.component";
import {RatingModule} from "ngx-bootstrap/rating";
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {AngularFireModule} from "@angular/fire/compat";
import { KanbanboardComponent } from './FrontOffice/kanbanboard/kanbanboard.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DndModule } from 'ngx-drag-drop';
import {HeaderBackComponent} from "./cyptolanding/header-back/header-back.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';//toast
import { ProjectFilterComponent } from './FrontOffice/projects/project-filter/project-filter.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddTeamComponent } from './FrontOffice/projects/add-team/add-team.component';
import { AddprojectWithTeamComponent } from './FrontOffice/projects/addproject-with-team/addproject-with-team.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UiSwitchModule } from 'ngx-ui-switch';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {PaginationModule} from "ngx-bootstrap/pagination";

import { UploadfilefirebaseComponent } from './FrontOffice/projects/uploadfiles/uploadfilefirebase/uploadfilefirebase.component';
import { firebaseenvir } from 'src/environments/firebaseenvir';
import { NgxFileDropModule } from 'ngx-file-drop';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent,
    HeaderFrontComponent,
    FooterFrontComponent,
    ListprojectsComponent,
    DetailProjectComponent,
    CommentsComponent,
    InternshipsDetailComponent,
    InternshipsComponent,
    KanbanboardComponent,
    KanbanboardComponent,
    HeaderBackComponent,
    AddTeamComponent,
    ProjectFilterComponent,
    AddprojectWithTeamComponent,
    UploadfilefirebaseComponent,

  ],

    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        NgApexchartsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        LayoutsModule,
        AppRoutingModule,
        ExtrapagesModule,
        ConfirmpagesModule,
        CarouselModule,
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        SharedModule,
        ScrollToModule.forRoot(),
        ToastrModule.forRoot(),
        KeycloakAngularModule,
        FormsModule,
        RatingModule,
        DndModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        NgApexchartsModule,
        NgxSliderModule,
        NgSelectModule,
        MatCheckboxModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),
        CKEditorModule,
        NgStepperModule,
        CdkStepperModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgSelectModule,
        UiSwitchModule,
        ShareButtonsModule,
        PaginationModule,

    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]},
      DatePipe
  ],
})
export class AppModule { }
