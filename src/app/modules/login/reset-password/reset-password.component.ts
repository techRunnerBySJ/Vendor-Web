import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  updatePasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required]),
      reEnterNewPassword: new FormControl('', [Validators.required]),
    },
    { validators: [this.customPasswordValidator()] }
  );
  newPasswordSent: boolean = false;
  fieldTextType: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private loginService: LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  /**
   * Method that checks newPassword field and re-enter new password field
   * values are same or not
   * @returns
   */
  customPasswordValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const newPassword = group['controls']['newPassword']['value'];
      const reEnterNewPassword =
        group['controls']['reEnterNewPassword']['value'];

      if (
        newPassword &&
        reEnterNewPassword &&
        newPassword !== reEnterNewPassword
      ) {
        group['controls']['reEnterNewPassword'].setErrors({
          passwordMismatch: true,
        });
      } else if (!reEnterNewPassword) {
        group['controls']['reEnterNewPassword'].setErrors({ required: true });
      } else {
        group['controls']['reEnterNewPassword'].setErrors(null);
      }
      return;
    };
  }

  /**
   * Method that reset password
   */
  resetPassword() {
    const newPassword = this.updatePasswordForm.get('newPassword').value;
    const reEnterNewPassword =
      this.updatePasswordForm.get('reEnterNewPassword').value;

    if (newPassword === reEnterNewPassword) {
      this.subscriptions.push(this.loginService.resetPassword(newPassword).subscribe((data) => {
        const res = data;
        if (res) {
          this.newPasswordSent = true;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data:
            {
              confirmBtnText: 'sign in',
              message: 'Password Updated Successfully',
              alert: 'true'
            }
          });
          dialogRef.afterClosed().subscribe(response => {
            if (response) {
              this.navigateToLoginForm();
            }
          })
        }
      }));
    } else {
      //toaster message
    }
  }

  /**
   * Method that navigates to login page
   */
  navigateToLoginForm() {
    this.router.navigate(['']);
  }

  /**
   * Method that shows and hides visibility of password
   * @returns boolean
   */
  passwordControlContainsData(): boolean {
    if (this.updatePasswordForm.get('newPassword').value.length > 0) {
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
