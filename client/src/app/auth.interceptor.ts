import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Login } from './services/login';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: Login, private router: Router) {}

  private isAuthEndpoint(url: string): boolean {
    // Avoid infinite loops / noisy refresh attempts on auth endpoints.
    return /\/auth\/(login|register|refresh|logout|revoke-token)(\b|\/|\?)/.test(url);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    const token = localStorage.getItem('cms_access_token');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } 

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    const refreshToken = localStorage.getItem('cms_refresh_token');
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }

    return this.loginService.refreshToken().pipe(
      switchMap((response: any) => {
        localStorage.setItem('cms_access_token', response.accessToken);
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });
        return next.handle(newReq);
      }),
      catchError((error) => {
        // Best-effort revoke; navigation is what matters here.
        this.loginService.logoutUser().subscribe({ error: () => {} });
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }
}
