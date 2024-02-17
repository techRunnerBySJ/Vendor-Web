import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';
import { MoreService } from '../../services/more.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  oldPassInputType: boolean;
  newPassInputType: boolean;
  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    repeatNewPassword: new FormControl('', [Validators.required]),
  }, { validators: [this.customPasswordValidator()] })
  constructor(private moreService: MoreService, private dialog: MatDialog, private messagingService: MessagingService,
    private router: Router) { }

  ngOnInit(): void {
  }

  /**
 * Method to update password.
 */
  updatePassword() {
    if (this.changePasswordForm.status === 'INVALID') return this.changePasswordForm.markAllAsTouched();
    this.moreService
      .updatePassword(
        this.changePasswordForm.get('oldPassword').value,
        this.changePasswordForm.get('newPassword').value
      )
      .subscribe((data) => {
        const res = data;
        if (res) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              confirmBtnText: 'sign in',
              message: 'Password Updated Successfully',
              alert: 'true',
            },
          });
          dialogRef.afterClosed().subscribe((response) => {
            if (response) {
              this.messagingService
                .deletePushNotificationToken()
                .subscribe((res) => {
                  localStorage.clear();
                  this.router.navigate(['login']);
                })
            }
          });
        }
      })
  }


  /**
   * Method that checks newPassword field and re-enter new password field
   * values are same or not
   * @returns
   */
  customPasswordValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const newPassword = group['controls']['newPassword']['value'];
      const repeatNewPassword =
        group['controls']['repeatNewPassword']['value'];

      if (
        newPassword &&
        repeatNewPassword &&
        newPassword !== repeatNewPassword
      ) {
        group['controls']['repeatNewPassword'].setErrors({
          passwordMismatch: true,
        });
      } else if (!repeatNewPassword) {
        group['controls']['repeatNewPassword'].setErrors({
          required: true,
        });
      } else {
        group['controls']['repeatNewPassword'].setErrors(null);
      }
      return;
    };
  }
}
