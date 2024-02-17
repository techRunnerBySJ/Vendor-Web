import { ErrorService } from './../../shared/services/error.service';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/shared/services/login.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  apiCallCount = 0;
  isRefresingToken: boolean;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  next: HttpHandler;
  constructor(
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private loginService: LoginService
  ) { }

  //identifies and handles a given HTTP Request
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.next = next;
    return this.handleHttpEvent(request);
  }

  /**
  * Method that handles all http requests
  * @param request 
  * @returns 
  */
  private handleHttpEvent(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const updatedRequest = this.addHeaders(request);
    return this.next.handle(updatedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !error.url.includes('user/token/refresh')) {
          return this.handle401Error(request);
        }
        else {
          throw this.errorService.errorHandler(error);
        }
      }),
      finalize(() => {
        this.apiCallCount -= 1;
        if (this.apiCallCount === 0) {
          this.spinner.hide();
        }
      })
    );
  }

  /**
   * Method that add headers to the http request
   * @param request 
   * @returns 
   */
  private addHeaders(request: HttpRequest<any>) {
    this.apiCallCount += 1;
    this.spinner.show();
    let body = request.body;
    let headers: HttpHeaders = new HttpHeaders();
    if (request.headers.get('ignore_headers') !== 'true') {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Content-Security-Policy', 'default-src');
      if (!request.headers.has('child_outlet_id')
        && request.headers.get('ignore_child_outletId') !== 'true'
        && localStorage.getItem('childOutletId')) {
        headers = headers.set('child_outlet_id', localStorage.getItem('childOutletId'));
      }

      if (request.headers.get('child_outlet_id')) {
        headers = headers.set('child_outlet_id', request.headers.get('child_outlet_id'));
      }

      if (request.headers.get('refresh_token') !== 'true' && localStorage.getItem('token')) {
        headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      }
      else if (request.headers.get('refresh_token') === 'true') {
        headers = headers.set('Authorization', `Bearer ${localStorage.getItem('refreshToken')}`);
      }
    }
    return request.clone({
      headers,
      body,
    });
  }

  /**
   * Method that handles 401 error in http request.
   * it refreshes the token and executes all failed http requests.
   * @param request 
   * @returns 
   */
  private handle401Error(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.isRefresingToken) {
      return this.refreshTokenSubject.pipe(
        filter(token => (token !== null)),
        take(1),
        switchMap(() => {
          return this.handleHttpEvent(request);
        })
      );
    } else {
      this.isRefresingToken = true;
      this.refreshTokenSubject.next(null);
      return this.loginService.refreshAuthToken().pipe(
        switchMap(() => {
          this.isRefresingToken = false;
          this.refreshTokenSubject.next(true);
          return this.handleHttpEvent(request);
        })
      )
    }
  }
}
