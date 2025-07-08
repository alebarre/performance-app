import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'resetpassword', component: Resetpassword },
  { path: 'user/verify/account/:key', component: Verify },
  { path: 'user/verify/password/:key', component: Verify },
  { path: '**', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
