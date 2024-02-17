import { Component, OnInit } from '@angular/core';
import { Order } from '../my-orders/model/order';
import { MyOrdersService } from 'src/app/shared/services/my-orders.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOrderDialogComponent } from '../my-orders/confirm-order-dialog/confirm-order-dialog.component';
import { SponsoredOrders } from './model/sponsored-order';
import { SponsoredRiderDialogComponent } from './sponsored-rider-dialog/sponsored-rider-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { HomeService } from 'src/app/shared/services/home.service';
import { ISocketEventEmitter, SocketOrderDetails } from '../home/model/home';

@Component({
  selector: 'app-sponsored-order',
  templateUrl: './sponsored-order.component.html',
  styleUrls: ['./sponsored-order.component.scss']
})
export class SponsoredOrderComponent implements OnInit {

  ordersList: SponsoredOrders[] = [];
  currentPage: number = 1
  pageSize: number = 8;
  totalOrders: number;
  orderStatus: string;
  private subscription: Subscription;
  removeRiderReason: string;
  currentTime: Date;
  riderAssignTimerInterval: any;
  subscriptions: Subscription[] = [];
  constructor(private myOrderService: MyOrdersService, private sharedService: SharedService, private dialog: MatDialog, private toastMsgService: ToastService, private router: Router, private homeService: HomeService) { }

  ngOnInit(): void {
    this.socketEventListener();
    this.getSponsoredOrderData('pending');
    this.subscription = interval(30000).subscribe(() => {
      this.getSponsoredOrderData('pending');
    });
  }

  /**
   * Method that get orders for sponsored rider
   * @param field 
   */
  getSponsoredOrderData(field?: string) {
    this.myOrderService.getSponsoredRiderOrders().subscribe(res => {
      clearInterval(this.riderAssignTimerInterval);
      this.totalOrders = res['result'];
      this.ordersList = [];
      if(field === 'pending') {
        this.orderStatus = 'pending'
        for(const i of res['result']['pending']){
          this.ordersList.push(SponsoredOrders.fromJson(i));
        }
      }
      if(field === 'assigned') {
        this.orderStatus = 'assigned';
        for(const i of res['result']['assigned']){
          this.ordersList.push(SponsoredOrders.fromJson(i));
        }
      }
      if(field === 'accepted') {
        this.orderStatus = 'accepted';
        for(const i of res['result']['accepted']){
          this.ordersList.push(SponsoredOrders.fromJson(i));
        }
      }
      this.setRiderAssignTimerInterval();
    })
  }

  /**
   * Method that set timer interval to update rider assign timer
   */
  setRiderAssignTimerInterval() {
    this.riderAssignTimerInterval = setInterval(() => {
      this.updateRiderAssignTimer();
    }, 1000);
  }

  /**
   * Method that open order details modal
   * @param orderId 
   */
  openOrderDetailsModal(orderId: number) {
    this.sharedService.setOrderDetailsModal(true, orderId);
  }

  /**
   * Method that get available sponsored riders
   * @param orderId 
   */
  getAvailableSponsoredRiders(orderId: number) {
    const dialogRef = this.dialog.open(SponsoredRiderDialogComponent, {
      data: {
        orderId: orderId,
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      this.getSponsoredOrderData('pending');
    }) 
  }

  /**
   * Method that surrender sponsored order
   * @param orderId 
   */
  surrenderSponsoredOrder(orderId: string) {
    const data = {
      rider_id: this.ordersList['riderId'],
      rider_name: this.ordersList['riderName']
    }
    this.myOrderService.postSurrenderSponsoredOrder(orderId,data).subscribe(res => {
      this.toastMsgService.showSuccess('Order Surrendered Successfully !!!');
    })
    this.getSponsoredOrderData('pending');
  }

  /**
   * Method that navigate sponsored order page to new window
   */
  navigateToNewWindow() {
    const link = this.router.createUrlTree(['/sponsored-order']).toString();
    window.open(link, '_blank');
  }

  /**
   * Method that remove rider from order
   * @param orderId 
   */
  removeRider(orderId: string) {
    const data = {
      reason: this.removeRiderReason
    }
    this.myOrderService.postRemoveSponsoredRiderEndPoint(orderId, data).subscribe(res => {
      this.toastMsgService.showSuccess('Rider Removed Successfully !!!')
    })
    this.removeRiderReason = null;
    this.getSponsoredOrderData('pending');
  }

  /**
   * Method that update order-acceptance-timer for vendor of each new-order
   * @returns
   */
  updateRiderAssignTimer() {
    for (const i of this.ordersList) {
      this.currentTime = new Date();
      let secs = Math.floor(
        (i['timerEndTime'].getTime() - this.currentTime.getTime()) / 1000
      );
      if (secs <= 0) {
        i['isTimerDanger'] = true;
        i['progressbarWidth'] = 0.5;
        i['timeLeft'] = 'Waiting to Assign';
      } else {
        i['progressbarWidth'] =
          secs * (100 / (i['acceptanceTimeInMilliSecs'] / 1000));

        if (i['progressbarWidth'] <= 50) {
          i['isTimerAlert'] = true;
        }
        if (i['progressbarWidth'] <= 20) {
          i['isTimerAlert'] = false;
          i['isTimerDanger'] = true;
        }
        let minutes = Math.floor(secs / 60);
        secs = secs % 60;
        i['timeLeft'] =
          ('0' + minutes).slice(-2) + ':' + ('0' + secs).slice(-2);
      }
    }
  }

  socketEventListener() {
    this.subscriptions.push(
      this.homeService.socketEventEmitter.subscribe(
        (event: ISocketEventEmitter) => {
          const socketData: SocketOrderDetails = event.socketData;
          if (event.type === 'RIDER_ORDER_ACCEPTED') {
            this.getSponsoredOrderData();
            this.toastMsgService.showInfo(
              `Order ID: ${socketData.sponsorOrderId} is accepted by Rider`,
              'Rider accepted the order',
              {
                timeOut: 7000,
              }
            );
          }          
          else if (event.type === 'RIDER_ORDER_IGNORED') {
              this.toastMsgService.showInfo(
                `Order ID: ${socketData.sponsorOrderId} is ignored by Rider`,
                'Rider ignored the order',
                {
                  timeOut: 7000,
                }
              );
          }
          else if (event.type === 'RIDER_ORDER_REJECTED') {
              this.toastMsgService.showInfo(
                `Order ID: ${socketData.sponsorOrderId} is rejected by Rider`,
                'Rider rejected the order',
                {
                  timeOut: 7000,
                }
              );
          }

        }
      )

    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.riderAssignTimerInterval);
  }
}
