import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/reset-password/reset-password';
import { Verify } from './component/verify/verify';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Customers } from './component/customers/customers';
import { Profile } from './component/profile/profile';
import { Home } from './component/home/home';
import { NavBar } from './component/nav-bar/nav-bar';
import { Stats } from './component/stats/stats';

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
    Stats
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
