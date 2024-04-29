import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeKeycloak } from './authUtils';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { VideoConferenceComponent } from './chatComponents/video-conference/video-conference.component';

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

import { HeaderBackComponent } from './cyptolanding/header-back/header-back.component';
import { FooterBackComponent } from './cyptolanding/footer-back/footer-back.component';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent,
    VideoConferenceComponent,
    HeaderFrontComponent,
    FooterFrontComponent,
    ListprojectsComponent,
    DetailProjectComponent,
    CommentsComponent,
    InternshipsDetailComponent,
    InternshipsComponent,
    HeaderBackComponent,
    FooterBackComponent

  ],
  imports: [
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


  ],
  bootstrap: [AppComponent],
  providers: [


    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,

      deps: [KeycloakService]
    }

      deps: [KeycloakService]},
      DatePipe

  ],
  exports: [
    HeaderBackComponent
  ]
})
export class AppModule { }

// Path: talentgatewayFrontEnd/src/app/pages/pages.module.ts
