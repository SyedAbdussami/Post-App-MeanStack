import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './components/error/error.component';
import { AuthInterceptor } from './services/auth-interceptor';
import{ErrorInterceptor}from './services/error-interceptor';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import{AngularMaterialModule} from './angular-material.module'
import { PostModule } from './post.module';
import{AuthModule} from './auth.module'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostModule,
    AuthModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true}],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
