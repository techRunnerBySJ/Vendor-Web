import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    userLoginId: new FormControl('',[Validators.required]),
  });
  loginIdSent: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastMsgService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  /**
   * Method that sends login id for forgot password
   **/
  sendLoginId() {
    this.loginService.loginId  = this.forgotPasswordForm.get('userLoginId').value;
    this.subscriptions.push(this.loginService.sendLoginId(this.loginService.loginId).subscribe((data) => {
      const res = data;
      if (res) {
        this.loginIdSent = true;
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data:
          {
            type: 'success',
            message: res.result.data,
          }
        });
        this.navigateToVerifyOtpPage();
      }
    }));
  }

  /**
   * Method that navigates to login page
   */
  navigateToLoginPage() {
    this.router.navigate(['']);
  }

  /**
   * Method that navigates to otp verification page
   */
  navigateToVerifyOtpPage() {
    this.router.navigate(['/login/verify-otp']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(!subscription.closed) {
        subscription.unsubscribe();
      }
    })
  }
}

