import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/shared/services/home.service';
import { SubscriptionService } from 'src/app/shared/services/subscription.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {
  PlanType,
  Subscription,
  SubscriptionAction,
  SubscriptionAuthStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionStatusList,
} from '../model/subscription';
import { SubscriptionDialogComponent } from '../subscription-dialog/subscription-dialog.component';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss'],
})
export class SubscriptionPlansComponent implements OnInit {
  subscriptionPlansList: SubscriptionPlan[];
  currentSubscriptionStatus: SubscriptionStatus[] = [
    'active',
    'initialized',
    'on_hold',
    'bank_approval_pending',
  ];
  currentSubscription: Subscription;
  showSubscriptionModal: boolean;
  readonly subscriptionStatusList = SubscriptionStatusList;
  readonly planType = PlanType;

  subscriptionForm = new FormGroup({
    planId: new FormControl({ disabled: true, value: '' }, [
      Validators.required,
    ]),
    planName: new FormControl({ disabled: true, value: '' }, [
      Validators.required,
    ]),
    customerName: new FormControl('', [Validators.required]),
    customerPhone: new FormControl('', [
      Validators.required,
      Validators.pattern('[6-9][0-9]{9}'),
    ]),
    customerEmail: new FormControl('', [
      Validators.required,
      this.customEmailValidator(),
    ]),
  });

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private toastMsgService: ToastService,
    private dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.getSubscriptionPlans();
    this.getCurrentSubscription();
  }

  /**
   * Method that gets all subscription plans
   */
  getSubscriptionPlans() {
    this.subscriptionService.filterSubscriptionPlans().subscribe((res) => {
      this.subscriptionPlansList = [];
      for (const i of res['result']['records']) {
        this.subscriptionPlansList.push(SubscriptionPlan.fromJson(i));
      }
    });
  }

  /**
   * Method that gets current subscription of the outlet
   */
  getCurrentSubscription() {
    const data = {
      filter: {
        status: this.currentSubscriptionStatus,
      },
    };
    this.subscriptionService.filterSubscriptions(data).subscribe((res) => {
      if (res['result']['records'].length)
        this.currentSubscription = Subscription.fromJson(
          res['result']['records'][0]
        );
    });
  }

  /**
   * Metohd that creates new subscription for the outlet
   */
  createSubscription() {
    const formValues = this.subscriptionForm.getRawValue();
    const data = {
      plan_id: formValues.planId,
      customer_name: formValues.customerName,
      customer_phone: `+91${formValues.customerPhone}`,
      customer_email: formValues.customerEmail,
    };
    this.subscriptionService.createSubscription(data).subscribe((res) => {
      const subscription: Subscription = Subscription.fromJson(res['result']['subscription']);
      if (subscription.authLink) {
        window.location.href = subscription.authLink;
      } else {
        this.closeSubscriptionModal();
        this.getCurrentSubscription();
        this.homeService.filterSubscriptions().subscribe(); // To update subs-details on home and my-orders page after buying subscription
      }
    });
  }

  /**
   * Method that cancel existing subscription
   */
  cancelSubscription() {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      data: {
        action: SubscriptionAction.Cancel,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          cancellation_reason: response.cancellationReason,
        };

        this.subscriptionService
          .cancelSubscription(this.currentSubscription.id, data)
          .subscribe((res) => {
            this.toastMsgService.showSuccess('Subscription is cancelled successfully');
            this.currentSubscription = null;
            this.homeService.filterSubscriptions().subscribe(); // To update subs-details on home and my-orders page after cancelling subscription
          });
      }
    });
  }

  /**
   * Method that retry payment for subscription that is on hold
   * @param event
   * @param subscription
   */
  retryPayment() {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      data: {
        action: SubscriptionAction.RetryPayment,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          next_payment_on: response.nextPaymentDate || undefined,
        };
        this.subscriptionService
          .retrySubscriptionPayment(this.currentSubscription.id, data)
          .subscribe((res) => {
            this.toastMsgService.showSuccess(
              `Retry Payment is done successfully`
            );
          });
      }
    });
  }

  /**
   * Metohd that opens the subscription modal after validating
   * @param plan
   * @returns
   */
  openSubscriptionModal(plan: SubscriptionPlan) {
    if (this.currentSubscription)
      return this.toastMsgService.showInfo(
        'Kindly cancel your current Subscription'
      );
    this.subscriptionForm.patchValue({
      planId: plan.id,
      planName: plan.name,
    });
    this.showSubscriptionModal = true;
  }

  /**
   * Method that closes the subscription modal
   */
  closeSubscriptionModal() {
    this.subscriptionForm.reset();
    this.showSubscriptionModal = false;
  }

  /**
   * Method to navigate to the more page.
   */
  navigateToMore() {
    this.router.navigate(['/more']);
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
}
