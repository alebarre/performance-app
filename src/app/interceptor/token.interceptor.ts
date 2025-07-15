import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Key } from '../enum/key.enum';
import { UserService } from '../service/userService';
import { CustomHttpResponse, Profiles } from '../interface/appstates';
import { Profile } from '../component/profile/profile';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isTokenRefreshing: boolean = false;
    private refreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profiles>> = new BehaviorSubject(null)

    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | Observable<HttpResponse<any>> {
        if (req.url.includes('verify')
            || req.url.includes('login')
            || req.url.includes('register')
            || req.url.includes('refresh')
            || req.url.includes('resetpassword')) {
            return next.handle(req);
        }
        return next.handle(this.addAuthorizationHeader(req, localStorage.getItem(Key.TOKEN)))
        .pipe(
            catchError((error: HttpErrorResponse) => {
                if (error instanceof HttpErrorResponse && error.status === 401 && error.error.reason.includes('expired')) {
                    return this.handleRefreshToken(req, next);
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private handleRefreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!this.isTokenRefreshing) {
            console.log('Refreshing token...');
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.userService.refreshToken$().pipe(
                switchMap((response) => {
                    console.log('Token refreshed response', response);
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(response);
                    console.log('New token', response.data.access_token);
                    console.log('Sending original request', req);
                    return next.handle(this.addAuthorizationHeader(req, response.data.access_token));
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                switchMap((response: CustomHttpResponse<Profiles>) => {
                        return next.handle(this.addAuthorizationHeader(req, response.data.access_token));
                })
            );
        }
    }

    

    private addAuthorizationHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
}