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
    HeaderBackComponent

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
    DndModule

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
