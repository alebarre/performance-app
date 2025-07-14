import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profiles } from '../interface/appstates';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

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

  profile$ = () => <Observable<CustomHttpResponse<Profiles>>>this.http
      .get<CustomHttpResponse<Profiles>>(`${this.server}/user/profile`, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJzdWIiOiJhbGViYXJyZUBob3RtYWlsLmNvbSIsIkFVVEhPUklUSUVTIjpbIlJFQUQ6VVNFUiIsIiBSRUFEOkNVU1RPTUVSIl0sImlzcyI6IlBFUkZPUk1BTkNFX1NQT1JUU19MTEMiLCJleHAiOjE3NTI1Mjc2NzgsImlhdCI6MTc1MjUyNTg3OH0.IHgpEy1Nz1hUD0UhLjsW8HjLwS08RlGAEfZiqYQsvripYEQxw9RdeVnpPyh52dwR4qYiZIEuFGuq-nk-CuQG4g'
        ),
      })
      .pipe(tap(console.log), catchError(this.handleError));

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
