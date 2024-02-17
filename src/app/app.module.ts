import { ComponentsModule } from './shared/components/components.module';
import { DirectivesModule } from './shared/directives/directives.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { LoginService } from './shared/services/login.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './core/interceptors/http-request-interceptors';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { ExceptionHandlerService } from './shared/services/exception-handler.service';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DirectivesModule,
    ComponentsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,

    ToastrModule.forRoot({
      timeOut: 2000,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    LoginService,
    CookieService,
    { provide: ErrorHandler, useClass: ExceptionHandlerService }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
