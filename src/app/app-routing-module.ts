import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/reset-password/reset-password';
import { Verify } from './component/verify/verify';
import { Customers } from './component/customers/customers';
import { Profile } from './component/profile/profile';
import { Home } from './component/home/home';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'resetpassword', component: Resetpassword },
  { path: 'user/verify/account/:key', component: Verify },
  { path: 'user/verify/password/:key', component: Verify },
  { path: 'customers', component: Customers },
  { path: 'profile', component: Profile },
  { path: '', component: Home },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
