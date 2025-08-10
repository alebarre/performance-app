import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service.ts';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { LoginState } from '../../interface/appstates';
import { DataState } from '../../enum/datastate.enum';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { Key } from '../../enum/key.enum';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  // Observable to hold the login state, initialized with a loaded state, this will be updated based on the login process
  public loginState$: Observable<LoginState> = of({
    dataState: DataState.LOADED,
  });

  // Subjects to hold phone and email for MFA, used to display the last 4 digits of the phone number and email
  // when the user is using MFA
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);

  public readonly DataState = DataState;

  constructor(private router: Router, private userService: UserService) {}
  
  ngOnInit(): void {
    this.userService.isAuthenticated() ? this.router.navigate(['/']) : this.router.navigate(['/login']);
  }

  /**
   * This method is called when the user submits the login form. It calls the userService to log in and
   * handles the response. If the user is using MFA, it updates the phone and email subjects. If the login
   * is successful, it navigates to the home page.
   */
  login(loginForm: NgForm): void {
    this.loginState$ = this.userService
      .login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map((response) => {
          if (response?.data?.user?.usingMfa) {
            this.phoneSubject.next(response.data.user.phone);
            this.emailSubject.next(response.data.user.email);
            return {
              dataState: DataState.LOADED,
              isUsingMfa: true,
              loginSuccess: false,
              phone: response.data.user.phone.substring(
                response.data.user.phone.length - 4
              ),
            };
          } else {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(
              Key.REFRESH_TOKEN,
              response.data.refresh_token
            );
            this.router.navigate(['/']);
            return { dataState: DataState.LOADED, loginSuccess: true };
          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: false,
            loginSuccess: false,
            error,
          });
        })
      );
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService
      .verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response) => {
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, loginSuccess: true };
        }),
        startWith({
          dataState: DataState.LOADING,
          isUsingMfa: true,
          loginSuccess: false,
          phone: this.phoneSubject.value.substring(
            this.phoneSubject.value.length - 4
          ),
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: true,
            loginSuccess: false,
            error,
            phone: this.phoneSubject.value.substring(
              this.phoneSubject.value.length - 4
            ),
          });
        })
      );
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
