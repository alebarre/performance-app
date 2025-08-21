import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './component/login/login.component';
import { Register } from './component/register/register.component';
import { Resetpassword } from './component/reset-password/reset-password.component';
import { Verify } from './component/verify/verify.component';
import { CustomersComponent } from './component/customers/customers.component';
import { Profile } from './component/profile/profile.component';
import { Home } from './component/home/home.component';
import { AuthenticationGuard } from './component/guard/authentication.guard';
import { NewCustomerComponent } from './component/new-customer.component/new-customer.component';
import { NewInvoiceComponent } from './component/new-invoice.component/new-invoice.component';
import { InvoicesComponent } from './component/invoices.component/invoices.component';
import { CustomerComponent } from './component/customer.component/customer.component';
import { InvoiceComponent } from './component/invoice.component/invoice.component';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'resetpassword', component: Resetpassword },
  { path: 'user/verify/account/:key', component: Verify },
  { path: 'user/verify/password/:key', component: Verify },
  { path: 'profile', component: Profile, canActivate: [AuthenticationGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers/new', component: NewCustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/new', component: NewInvoiceComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthenticationGuard] },
  { path: 'customer/:id', component: CustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/:id/:invoiceNumber', component: InvoiceComponent, canActivate: [AuthenticationGuard] },
  { path: '', component: Home, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
