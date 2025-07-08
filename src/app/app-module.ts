import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Resetpassword,
    Verify
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
