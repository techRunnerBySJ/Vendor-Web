import { ToastService } from 'src/app/shared/services/toast.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { Subscription } from 'rxjs';
import { Services } from 'src/app/shared/models';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = new FormGroup({
    userLoginId: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required]),
  });
  loginIdSent: boolean = false;
  passwdSent: boolean = false;
  fieldTextType: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastMsgService:ToastService
  ) {}

  ngOnInit(): void {}

  /**
   * Method that sends otp for verification
   */
  sendLoginIdAndPassword() {
    const loginId = this.loginForm.get('userLoginId').value;
    const passwd = this.loginForm.get('userPassword').value;
    this.subscriptions.push(this.loginService
      .sendLoginIdAndPassword(loginId, passwd)
      .subscribe((data) => {
        const res = data;
        if (res) {
          this.loginIdSent = true;
          this.passwdSent = true;
          const decode = jwt_decode(localStorage.getItem('token'));
          decode['data']['type'] !== Services.Grocery? this.router.navigate(['my-orders']) : this.router.navigate(['grocery-orders']);
          this.toastMsgService.showSuccess('Login Successful');
        }
      }));
  }

  /**
   * Method that navigates to forgot password page
   */
  navigateToForgotPassword() {
    this.router.navigate(['/login/forgot-password']);
  }

  /**
   * Method that shows and hides visibility of password
   * @returns boolean
   */
  passwordControlContainsData(): boolean {
    if (this.loginForm.get('userPassword').value.length > 0) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(!subscription.closed) {
        subscription.unsubscribe();
      }
    })
  }
}
