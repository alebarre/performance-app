import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profiles } from '../interface/appstates';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.post<CustomHttpResponse<Profiles>>
      (`${this.server}/user/login`, { email, password })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpResponse<Profiles>>>
    this.http.get<CustomHttpResponse<Profiles>>
      (`${this.server}/user/verify/code/${email}/${code}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  profile$ = () => <Observable<CustomHttpResponse<Profiles>>>
    this.http.get<CustomHttpResponse<Profiles>>
      (`${this.server}/user/profile`, { headers: new HttpHeaders().set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJzdWIiOiJhbGViYXJyZUBob3RtYWlsLmNvbSIsIkFVVEhPUklUSUVTIjpbIlJFQUQ6VVNFUiIsIlJFQUQ6Q1VTVE9NRVIiXSwiaXNzIjoiUEVSRk9STUFOQ0VfU1BPUlRTX0xMQyIsImV4cCI6MTc1MjI4OTQ4NywiaWF0IjoxNzUyMjg3Njg3fQ.-YiMKpfQPAAa05wFLyzbDx-Pm5j669RaoHSUsmK7ZbXzFmmFySYUoYrrbjyXIlVcQe4jhWGOofkFtr6XfikuOQ')})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

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
