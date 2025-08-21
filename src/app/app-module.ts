import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './component/login/login.component';
import { Register } from './component/register/register.component';
import { Resetpassword } from './component/reset-password/reset-password.component';
import { Verify } from './component/verify/verify.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { CustomersComponent } from './component/customers/customers.component';
import { Profile } from './component/profile/profile.component';
import { Home } from './component/home/home.component';
import { NavBar } from './component/nav-bar/nav-bar';
import { StatsComponent } from './component/stats/stats.component';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { ReportModal } from './component/modals/report-modal/report-modal.component';
import { CommonModule } from '@angular/common';
import { ErrorModal } from './component/modals/error-modal/error-modal.component';
import { NewCustomerComponent } from './component/new-customer.component/new-customer.component';
import { NewInvoiceComponent } from './component/new-invoice.component/new-invoice.component';
import { InvoicesComponent } from './component/invoices.component/invoices.component';
import { CustomerComponent } from './component/customer.component/customer.component';
import { InvoiceComponent } from './component/invoice.component/invoice.component';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Resetpassword,
    Verify,
    CustomersComponent,
    Profile,
    Home,
    NavBar,
    StatsComponent,
    ReportModal,
    ErrorModal,
    NewCustomerComponent,
    NewInvoiceComponent,
    InvoicesComponent,
    CustomerComponent,
    InvoiceComponent
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
