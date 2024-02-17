import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from 'src/app/shared/services/subscription.service';
import {
  SubscriptionPayment,
  SubscriptionPaymentStatus,
} from '../model/subscription';

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss'],
})
export class SubscriptionPaymentComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 4;
  subscriptionPaymentList: SubscriptionPayment[] = [];
  totalSubscriptionPaymentRecords: number;
  filterBySubscriptionId: string;
  readonly subscriptionPaymentStatus = SubscriptionPaymentStatus;
  isPaymentBySubscriptionId: boolean;

  constructor(
    private subscriptionService: SubscriptionService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe((data) => {
      this.filterBySubscriptionId = data.subscriptionId;
    });
  }

  ngOnInit(): void {
    this.getSubscriptionPayments();
  }

  /**
   * Method that filters subscription payment data
   */
  getSubscriptionPayments() {
    const data = {
      filter: {},
    };
    if (this.filterBySubscriptionId) {
      data['filter']['subscription_id'] = this.filterBySubscriptionId;
      this.isPaymentBySubscriptionId = true;
    }

    this.subscriptionService
      .filterSubscriptionPayment(data)
      .subscribe((res) => {
        this.totalSubscriptionPaymentRecords = res['result']['total_records'];
        this.subscriptionPaymentList = [];
        for (const i of res['result']['records']) {
          this.subscriptionPaymentList.push(SubscriptionPayment.fromJson(i));
        }
      });
  }

  /**
   * Method that show all payments
   */
  showAllPayments() {
    this.isPaymentBySubscriptionId = false;
    this.filterBySubscriptionId = null;
    this.router.navigate([], { queryParams: { subscriptionId: null}});
    const data = {
      filter: {},
    };
    this.subscriptionService
    .filterSubscriptionPayment(data)
    .subscribe((res) => {
      this.totalSubscriptionPaymentRecords = res['result']['total_records'];
      this.subscriptionPaymentList = [];
      for (const i of res['result']['records']) {
        this.subscriptionPaymentList.push(SubscriptionPayment.fromJson(i));
      }
    });
  }
}
