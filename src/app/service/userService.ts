import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profiles } from '../interface/appstates';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private readonly server: string = 'http://localhost:8080';
  private readonly jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profiles>>>this.http
      .post<CustomHttpResponse<Profiles>>(`${this.server}/user/login`, {
        email,
        password,
      })
      .pipe(tap(console.log), catchError(this.handleError));

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profiles>>>(
      this.http
        .get<CustomHttpResponse<Profiles>>(
          `${this.server}/user/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  profile$ = () => <Observable<CustomHttpResponse<Profiles>>>
    this.http.get<CustomHttpResponse<Profiles>>
      (`${this.server}/user/profile`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  update$ = (user: User) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/update`, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profiles>>>
    this.http.get<CustomHttpResponse<Profiles>>
      (`${this.server}/user/refresh/token`, { headers: { Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}` } })
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
        }),
        catchError(this.handleError)
      );

  updatePassword$ = (form: { currentPassword: string, newPassword: string, confirmNewPassword: string }) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/update/password`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateRoles$ = (roleName: string) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/update/role/${roleName}`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateAccountSettings$ = (settings: { enabled: boolean, notLocked: boolean }) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/update/settings`, settings)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  toggleMfa$ = () => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/togglemfa`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  
  updateImage$ = (formData: FormData) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.patch<CustomHttpResponse<Profiles>>
      (`${this.server}/user/update/image`, formData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  isAuthenticated = (): boolean => (this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.TOKEN)) 
                              && !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN))) ? true : false; 
  
  logOut = (): void => {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A Client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
      } else {
        errorMessage = `An error ocurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
