import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MoreService } from 'src/app/shared/services/more.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { HomeService } from 'src/app/shared/services/home.service';
import { OutletUsers } from '../model/more';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MessagingService } from 'src/app/shared/services/messaging.service';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/shared/models/constants/constant.type';
import { DeliveryChargesPaidBy } from '../../home/model/home';
import { SharedService } from 'src/app/shared/services/shared.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-outlet-info',
  templateUrl: './outlet-info.component.html',
  styleUrls: ['./outlet-info.component.scss'],
})
export class OutletInfoComponent implements OnInit, OnDestroy {
  updatePasswordForm = new FormGroup(
    {
      userOldPassword: new FormControl('', [Validators.required]),
      userNewPassword: new FormControl('', [Validators.required]),
      userRepeatNewPassword: new FormControl('', [Validators.required]),
    },
    { validators: [this.customPasswordValidator()] }
  );

  userDetailsForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z A-Z]*'),
    ]),
    userEmail: new FormControl('', [
      Validators.required,
      this.customEmailValidator(),
    ]),
    userPhone: new FormControl('', [
      Validators.required,
      Validators.pattern('[6-9][0-9]{9}'),
    ]),
    userRole: new FormControl('', [Validators.required]),
    userLoginId: new FormControl({ disabled: true, value: '' }),
  });

  changePassword: boolean = false;
  showUserDetailsModal: boolean = false;
  editUser: boolean = false;
  loginIdSent: boolean = false;
  oldPasswodSent: boolean = false;
  newPasswordSent: boolean = false;
  userLoginId: string;
  userNameSent: boolean = false;
  userEmailSent: boolean = false;
  userPhoneSent: boolean = false;
  userRoleSent: boolean = false;
  isNewUser: boolean;
  fieldTextTypeForOldPassword: boolean;
  fieldTextTypeForNewPassword: boolean;
  roles = ['owner', 'manager'];

  fssaiUrl: string;
  gstUrl: string;
  // deliveryChargesPaidBy: DeliveryChargesPaidBy;
  // isEditDeliveryCharges: boolean;
  // freeDelivery: boolean;
  outletUsersList: OutletUsers[] = [];
  role: Role;
  subscriptions: Subscription[] = [];
  fssaiText: string;
  isDeliveryChargesPaidByOutlet: boolean;
  minOrderValForFreeDeliveryByOutlet: number;
  gstCategory: string;
  
  constructor(
    private router: Router,
    private moreService: MoreService,
    private homeService: HomeService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private messagingService: MessagingService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.homeService.outletDetails$.subscribe((data) => {
        if (data?.has(localStorage.getItem('childOutletId') || 'primaryOutlet')) {
          const outletDetails = data.get(localStorage.getItem('childOutletId') || 'primaryOutlet')
          this.fssaiUrl = outletDetails.fssaiCertUrl ? outletDetails.fssaiCertUrl : outletDetails.fssaiAckUrl;
          this.gstUrl = outletDetails.gstUrl;
          this.gstCategory = outletDetails.gstCategory;
          // this.deliveryChargesPaidBy = outletDetails.deliveryChargesPaidBy;
          this.fssaiText = outletDetails.hasFssaiCertificate? 'FSSAI' : 'FSSAI Application';
          this.isDeliveryChargesPaidByOutlet = outletDetails.isDeliveryChargesPaidByOutlet;
          this.minOrderValForFreeDeliveryByOutlet = outletDetails.minOrderValForFreeDeliveryByOutlet;
        }
        
      })
    );
    this.role = this.homeService.role;
    if (this.role === 'owner') {
      this.getOutletUsersList();
    }

    this.subscriptions.push(
      this.sharedService.resetData$.pipe(skip(1)).subscribe(flag => {
        if (flag) this.reinitializeData();
      })
    )
  }

  /**
   * Method that will invokes when user changes 
   * outlet from home-component and it will recalls 
   * methods to update data for the selected outlet
   */
   reinitializeData() {
    const outletDetails = this.homeService.outletDetails.get(localStorage.getItem('childOutletId') || 'primaryOutlet')
    this.fssaiUrl = outletDetails.fssaiCertUrl ? outletDetails.fssaiCertUrl : outletDetails.fssaiAckUrl;
    this.gstUrl = outletDetails.gstUrl;
    // this.deliveryChargesPaidBy = outletDetails.deliveryChargesPaidBy;
    if (this.role === 'owner') {
      this.getOutletUsersList();
    }
  }

  /**
   * Method that fetch all users list of this outlet
   */
  getOutletUsersList() {
    this.subscriptions.push(
      this.moreService.getOutletUsersDetails().subscribe((res) => {
        this.outletUsersList = [];
        for (const i of res['result']) {
          this.outletUsersList.push(OutletUsers.fromJson(i));
        }
      })
    );
  }

  /**
   * Method that change active status of vendor user
   * @param user
   */
  changeUserActiveStatus(user: OutletUsers) {
    const data = {
      active: !user.isActive,
    };
    this.subscriptions.push(
      this.moreService.changeUserStatus(user.loginId, data).subscribe((res) => {
        user.isActive = !user.isActive;
        this.toastMsgService.showSuccess('Status changed successfully');
      })
    );
  }

  /**
   * Method that checks newPassword field and re-enter new password field
   * values are same or not
   * @returns
   */
  customPasswordValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const userNewPassword = group['controls']['userNewPassword']['value'];
      const userRepeatNewPassword =
        group['controls']['userRepeatNewPassword']['value'];

      if (
        userNewPassword &&
        userRepeatNewPassword &&
        userNewPassword !== userRepeatNewPassword
      ) {
        group['controls']['userRepeatNewPassword'].setErrors({
          passwordMismatch: true,
        });
      } else if (!userRepeatNewPassword) {
        group['controls']['userRepeatNewPassword'].setErrors({
          required: true,
        });
      } else {
        group['controls']['userRepeatNewPassword'].setErrors(null);
      }
      return;
    };
  }

  /**
   * Method that validates email field pattern
   * @returns
   */
  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const val = control.value;
      if (
        val &&
        !val.match('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ) {
        return { email: true };
      }
    };
  }

  /**
   * Method to update password.
   */
  updatePassword() {
    if (this.updatePasswordForm.status === 'INVALID') return this.updatePasswordForm.markAllAsTouched();
    this.subscriptions.push(
      this.moreService
        .updatePassword(
          this.updatePasswordForm.get('userOldPassword').value,
          this.updatePasswordForm.get('userNewPassword').value
        )
        .subscribe((data) => {
          const res = data;
          if (res) {
            this.loginIdSent = true;
            this.oldPasswodSent = true;
            this.newPasswordSent = true;
            //this.toastMsgService.showSuccess('Password Updated Successfully');
            //this.navigateToLoginForm();
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: {
                confirmBtnText: 'sign in',
                message: 'Password Updated Successfully',
                alert: 'true',
              },
            });
            dialogRef.afterClosed().subscribe((response) => {
              if (response) {
                this.subscriptions.push(
                  this.messagingService
                    .deletePushNotificationToken()
                    .subscribe((res) => {
                      localStorage.clear();
                      this.router.navigate(['login']);
                    })
                );
              }
            });
          }
        })
    );
  }

  /**
   * Method to invite new user and update user details.
   */
  submitUserDetails() {
    const data = {
      email: this.userDetailsForm.get('userEmail').value,
      role: this.userDetailsForm.get('userRole').value,
      name: this.userDetailsForm.get('userName').value,
      phone: `+91${this.userDetailsForm.get('userPhone').value}`,
    };
    if (this.isNewUser) {
      this.subscriptions.push(
        this.moreService.inviteNewUser(data).subscribe((data) => {
          const res = data;
          if (res) {
            this.userEmailSent = true;
            this.userRoleSent = true;
            this.userNameSent = true;
            this.userPhoneSent = true;
            this.toggleUserDetailsModal();
            this.getOutletUsersList();
            this.toastMsgService.showSuccess('User Created Successfully');
          }
        })
      );
    } else {
      this.subscriptions.push(
        this.moreService
          .updateUserDetails(
            this.userDetailsForm.get('userLoginId').value,
            data
          )
          .subscribe((res) => {
            this.toggleUserDetailsModal();
            this.getOutletUsersList();
            this.toastMsgService.showSuccess(
              'User details updated successfully'
            );
          })
      );
    }
  }

  /**
   * Method that deletes user from outlet
   * @param user
   */
  deleteUser(user: OutletUsers) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'Remove',
        dismissBtnText: 'Not Now',
        message: `Are you sure you want to delete the user: ${user.userName}?`,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.subscriptions.push(
          this.moreService.deleteUserDetails(user.loginId).subscribe((res) => {
            this.getOutletUsersList();
            this.toastMsgService.showSuccess('User deleted successfully');
          })
        );
      }
    });
  }

  /**
   * Method to navigate to the more page.
   */
  navigateToMore() {
    this.router.navigate(['/more']);
  }

  /**
   * Method to toggle change password modal.
   */
  toggleChangePasswordModal() {
    this.changePassword = !this.changePassword;
  }

  /**
   * Method to navigate to the login page after updatng password.
   */
  navigateToLogin() {
    this.router.navigate(['']);
  }

  /**
   * Method that open invite user modal
   */

  openInviteUserModal() {
    this.isNewUser = true;
    this.userDetailsForm.get('userRole').enable();
    this.toggleUserDetailsModal();
  }

  /**
   * Method that open edit user modal
   * @param user
   */
  openEditUserModal(user: OutletUsers) {
    this.isNewUser = false;
    this.toggleUserDetailsModal();
    this.userDetailsForm.patchValue({
      userName: user.userName,
      userEmail: user.userEmail,
      userPhone: user.userPhone,
      userRole: user.userRole,
      userLoginId: user.loginId,
    });
    user.userRole === 'owner'
      ? this.userDetailsForm.get('userRole').disable()
      : this.userDetailsForm.get('userRole').enable();
  }

  /**
   * Method to toggle invite user modal.
   */
  toggleUserDetailsModal() {
    this.showUserDetailsModal = !this.showUserDetailsModal;
    this.userDetailsForm.reset();
  }

  /**
   * Method that shows and hides visibility of password
   * @returns boolean
   */
  newPasswordControlContainsData(): boolean {
    if (this.updatePasswordForm.get('userNewPassword').value.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Method that shows and hides visibility of password
   * @returns boolean
   */
  oldPasswordControlContainsData(): boolean {
    if (this.updatePasswordForm.get('userOldPassword').value.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Method that opens file in new tab
   * @param url
   */
  viewFile(url) {
    window.open(url);
  }

  /**
   * Method that invokes on edit btn click
   */
  // onEditDeliveryChargesPaidBy() {
  //   this.isEditDeliveryCharges = true; 
  //   this.deliveryChargesPaidBy === 'customer' ? this.freeDelivery = false : this.freeDelivery = true;
  // }

  /**
 * Method that submits the updated delivery charges payment method to the API and shows a success message
 */
// submitDeliveryChargesPaidBy(): void {
//   const data = { free_delivery: this.freeDelivery };
//   this.subscriptions.push(
//     this.homeService.updateOutletDetails(data).subscribe(res => {
//       this.isEditDeliveryCharges = false;
//       const deliveryChargesPaidBy = res['result']['delivery_charge_paid_by'];
//       const key = localStorage.getItem('childOutletId') || 'primaryOutlet';
//       const val = { ...this.homeService.outletDetails.get(key), deliveryChargesPaidBy }
//       this.homeService.outletDetails.set(key, val);
//       this.homeService.outletDetails$.next(this.homeService.outletDetails);
//       this.toastMsgService.showSuccess('Delivery charges paid by updated successfully');
//     })
//   );
// }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subcription) => {
      if (!subcription.closed) {
        subcription.unsubscribe();
      }
    });
  }
}
