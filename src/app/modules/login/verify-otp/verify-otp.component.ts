import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'ng-otp-input/lib/models/config';
import { Subscription } from 'rxjs';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { LoginService } from 'src/app/shared/services/login.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  //configurations for otp input boxes
  config: Config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '1.5em',
      height: '1.5em',
      margin: '0.6em 0.6em 1em 0',
      padding: '8px',
      'font-size': '35px',
    },
  };
  otp: string;
  otpSent: boolean = false;
  subscriptions: Subscription[] = [];
  loginIdSent: boolean;

  canResendEmailOtp: boolean = true;
  emailInterval: any;
  emailOtpResendTimer: number = 30;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastMsgService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startEmailOtpResendTimer();
  }
  /**
   * Method that invokes when user enters otp
   * @param otp
   */
  onOtpChange(otp: string) {
    this.otp = otp;
  }

  /**
   * Method that verify otp api call and navigates to change password page
   */
  validateOtp() {
    this.subscriptions.push(this.loginService.validateOtp(this.otp).subscribe((data) => {
      const res = data;
      if (res) {
        this.otpSent = true;
        this.stopEmailOtpResendTimer();
        this.naviagteToResetPasswordPage();
      }
    }));
  }

  /**
   * Method that makes send otp api call
   */
  resendOtp() {
    this.subscriptions.push(this.loginService.sendLoginId(this.loginService.loginId).subscribe((data) => {
      const res = data;
      if(res){
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data:
          {
            type: 'success',
            message: res.result.data,
          }
        });
        this.startEmailOtpResendTimer();
      }
    }))
  }

  /**
   * Method that navigates to login page
   */
  navigatesToLoginPage() {
    this.stopEmailOtpResendTimer();
    this.router.navigate(['']);
  }

  /**
   * Method that navigates to update password page
   */
  naviagteToResetPasswordPage() {
    this.router.navigate(['/login/reset-password']);
  }

  /**
   * Method that start timer of 30 secs to resend email otp
   */
  startEmailOtpResendTimer() {
    this.canResendEmailOtp = false;
    this.emailInterval = setInterval(() => {
      this.emailOtpResendTimer--;
      if (this.emailOtpResendTimer === 0) {
        this.stopEmailOtpResendTimer();
      }
    }, 1000)
  }

  /**
   * Method that stop timer for resend email otp
   */
  stopEmailOtpResendTimer() {
    clearInterval(this.emailInterval);
    this.emailOtpResendTimer = 30;
    this.canResendEmailOtp = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(!subscription.closed) {
        subscription.unsubscribe();
      }
    })
  }
}

