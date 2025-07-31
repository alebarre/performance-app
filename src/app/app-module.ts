import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/reset-password/reset-password';
import { Verify } from './component/verify/verify';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { Customers } from './component/customers/customers';
import { Profile } from './component/profile/profile';
import { Home } from './component/home/home';
import { NavBar } from './component/nav-bar/nav-bar';
import { Stats } from './component/stats/stats';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { ReportModal } from './component/modals/report-modal/report-modal';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Resetpassword,
    Verify,
    Customers,
    Profile,
    Home,
    NavBar,
    Stats,
    ReportModal
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [App]
})
export class AppModule { }
