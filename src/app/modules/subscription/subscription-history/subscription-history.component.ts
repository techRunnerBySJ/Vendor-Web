import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/shared/services/subscription.service';
import {
  PlanType,
  Subscription,
  SubscriptionStatus,
  SubscriptionStatusList,
} from '../model/subscription';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss'],
})
export class SubscriptionHistoryComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 4;
  subscriptionHistoryList: Subscription[] = [];
  totalSubscriptionRecords: number;
  subscriptionHistoryStatus: SubscriptionStatus[] = [
    'cancelled',
    'completed',
    'failed_to_cancel',
  ];
  readonly planType = PlanType;
  greenStatusArr = [
    SubscriptionStatusList.active,
    SubscriptionStatusList.completed,
  ];
  orangeStatusArr = [
    SubscriptionStatusList.pending,
    SubscriptionStatusList.bank_approval_pending,
    SubscriptionStatusList.initialized,
    SubscriptionStatusList.on_hold,
  ];
  redStatusArr = [
    SubscriptionStatusList.cancelled,
    SubscriptionStatusList.failed_to_cancel,
  ];
  yellowStatusArr = [SubscriptionStatusList.on_hold];

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private toastMsgService: ToastService
  ) {}

  ngOnInit(): void {
    this.getSubscriptionHistory();
  }

  /**
   * Method that gets all subscription history of the outlet
   */
  getSubscriptionHistory() {
    const data = {
      filter: {
        status: this.subscriptionHistoryStatus,
      },
      pagination: {
        page_index: this.currentPage - 1,
        page_size: this.pageSize,
      },
    };
    this.subscriptionService.filterSubscriptions(data).subscribe((res) => {
      this.totalSubscriptionRecords = res['result']['total_records'];
      this.subscriptionHistoryList = [];
      for (const i of res['result']['records']) {
        this.subscriptionHistoryList.push(Subscription.fromJson(i));
      }
    });
  }

  /**
   * Method that navigates to subscription payment page with queryparams
   * @param subscriptionId
   */
  navigateToSubscriptionPayment(subscriptionId: string) {
    this.router.navigate(['subscription/payment'], {
      queryParams: { subscriptionId },
    });
  }
}
