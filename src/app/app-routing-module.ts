import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './component/login/login.component';
import { Register } from './component/register/register.component';
import { Resetpassword } from './component/reset-password/reset-password.component';
import { Verify } from './component/verify/verify.component';
import { Customers } from './component/customers/customers.component';
import { Profile } from './component/profile/profile.component';
import { Home } from './component/home/home.component';
import { AuthenticationGuard } from './component/guard/authentication.guard';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'resetpassword', component: Resetpassword },
  { path: 'user/verify/account/:key', component: Verify },
  { path: 'user/verify/password/:key', component: Verify },
  { path: 'customers', component: Customers, canActivate: [AuthenticationGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthenticationGuard] },
  { path: '', component: Home, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
