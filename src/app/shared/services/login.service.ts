import { NgOtpInputModule } from 'ng-otp-input';
import {
  getSendLoginIdEndPoint,
  getValidateOtpEndPoint,
  getResetPasswordEndPoint,
  postRefreshTokenEndPoint,
} from './../../core/apiUrls';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getSendLoginIdandpasswdEndPoint } from '../../core/apiUrls';
import { ErrorService } from '../services/error.service';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  httpErrorMessage: string;
  result: string;
  loginId: string;
  password: string;
  otp: string;
  hash: string;
  token: string;
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private cookieService: CookieService
  ) {}

  /**
   * Method that sends login Id and Password for verification
   * @param loginId
   * @param password
   * @returns boolean
   */
  public sendLoginIdAndPassword(
    loginId: string,
    password: string
  ): Observable<any> {
    const data = {
      login_id: loginId,
      password: password,
    };
    return this.http.post(getSendLoginIdandpasswdEndPoint, data).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem(
          'refreshToken',
          response['result']['refresh_token']
        );
        // localStorage.setItem('deviceId', uuidv4())
        if (!this.cookieService.get('deviceId')) {
          this.cookieService.set(
            'deviceId',
            uuidv4(),
            new Date('2038-01-19 04:14:07')
          );
        }
        return response['status'];
      })
    );
  }

  /**
   * Method that sends login Id for forgot password
   * @param loginId
   * @returns boolean
   */
  public sendLoginId(loginId: string): Observable<any> {
    this.loginId = loginId;
    const data = {
      login_id: loginId,
    };
    return this.http.post(getSendLoginIdEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that validates otp
   * @param otp
   * @returns boolean
   */
  public validateOtp(otp: string): Observable<any> {
    const data = {
      login_id: this.loginId,
      otp: otp,
    };
    return this.http.post(getValidateOtpEndPoint, data).pipe(
      map((response) => {
        this.hash = response['result']['data'];
        return response['status'];
      })
    );
  }

  /**
   * Method that resets passowrd
   * @param password
   * @returns boolean
   */
  public resetPassword(password: string): Observable<any> {
    const data = {
      login_id: this.loginId,
      hash: this.hash,
      password: password,
    };
    return this.http.post(getResetPasswordEndPoint, data).pipe(
      map((response) => {
        return response['status'];
      })
    );
  }

  /**
   * Method that send refresh token
   * @returns response
   */
   refreshAuthToken(): Observable<any> {
    const headers = new HttpHeaders({
      refresh_token: 'true',
    });
    return this.http.post(postRefreshTokenEndPoint, {}, { headers }).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
      })
    );
  }
}

