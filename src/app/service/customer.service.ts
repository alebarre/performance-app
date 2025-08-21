import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Page, Profiles } from '../interface/appstates';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';
import { Customer } from '../interface/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  customers$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page & User & Stats>>>this.http
      .get<CustomHttpResponse<Page & User & Stats>>(`${this.server}/customers/list?page=${page}`)
      .pipe(tap(console.log), catchError(this.handleError));

  newCustomers$ = (customer: Customer) => <Observable<CustomHttpResponse<Customer & User>>>
    this.http
      .post<CustomHttpResponse<Customer & User>>
      (`${this.server}/customers/create`, customer)
      .pipe(tap(console.log), catchError(this.handleError));

  searchCustomers$ = (name: string = '', page: number = 0) => <Observable<CustomHttpResponse<Page & User>>>
    this.http.get<CustomHttpResponse<Page & User>>
      (`${this.server}/customers/search?name=${name}&page=${page}`)
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
