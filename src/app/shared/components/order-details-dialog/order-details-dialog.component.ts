import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryStatus, Order } from 'src/app/modules/my-orders/model/order';
import { ConfirmOrderDialogComponent } from '../../../modules/my-orders/confirm-order-dialog/confirm-order-dialog.component';
import { RejectOrderDialogComponent } from '../../../modules/my-orders/reject-order-dialog/reject-order-dialog.component';
import { MyOrdersService } from '../../services/my-orders.service';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { ToastService } from '../../services/toast.service';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit, OnDestroy {

  showHelpModal: boolean;
  currentTime: Date;
  service: string;
  interval: any;
  orderDetails: Order;
  isNewOrder: boolean;
  isPreparingOrder: boolean;
  subscriptions: Subscription[] = [];
  showPrintInvoiceModal: boolean;
  readonly Services = Services;

  constructor(private dialog: MatDialog, private renderer: Renderer2,
    private myOrderService: MyOrdersService, private toastMsgService: ToastService,
    private sharedService: SharedService, private router: Router) { 
    }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'overlay-enabled');
    this.service = this.myOrderService.service;
    this.subscriptions.push(
      this.sharedService.orderId$.subscribe(orderId => {

        this.router.navigate([], {queryParams: {orderId}})
        if (orderId) this.getOrderDetails(orderId);
      })
    );
  }

  /**
   * Method that makes API call to get order details
   */
  getOrderDetails(orderId: number) {
    this.myOrderService.getOrderDetailsById(orderId).subscribe((res) => {
      this.orderDetails = Order.fromJson(res['result']['records'][0]);
      this.identifyOrderType();
      this.interval = setInterval(() => { this.updateTimer() }, 1000);
    })
  }

  /**
   * Method that identifies if order is new or preparing
   */
  identifyOrderType() {
    const deliveryStatuses: DeliveryStatus[] = ['pending', 'accepted', 'rejected', 'allocated', 'arrived']
    this.isNewOrder = this.orderDetails.orderAcceptanceStatus === 'pending' && this.orderDetails.orderStatus === 'placed';

    this.isPreparingOrder = this.orderDetails.orderAcceptanceStatus === 'accepted'
      && deliveryStatuses.includes(this.orderDetails.deliveryStatus)
      && this.orderDetails.orderStatus === 'placed';
  }

  /**
   * Method that closes the modal
   */
  closeModal() {
    this.sharedService.setOrderDetailsModal(false);
    this.router.navigate([], {queryParams: {orderId: null}})
  }

  updateTimer() {
    this.currentTime = new Date();
    let secs = Math.floor((this.orderDetails['timerEndTime'].getTime() - this.currentTime.getTime()) / 1000);
    if (secs <= 0) {
      this.orderDetails['isTimerDanger'] = true;
      this.orderDetails['progressbarWidth'] = 0.5;
      this.orderDetails['timeLeft'] = "Waiting to Accept"
      clearInterval(this.interval);
    } else {
      this.orderDetails['progressbarWidth'] = secs * (100 / (this.orderDetails['acceptanceTimeInMilliSecs'] / 1000))

      if (this.orderDetails['progressbarWidth'] <= 50) {
        this.orderDetails['isTimerAlert'] = true;
      }
      if (this.orderDetails['progressbarWidth'] <= 20) {
        this.orderDetails['isTimerAlert'] = false;
        this.orderDetails['isTimerDanger'] = true;
      }
      let minutes = Math.floor(secs / 60);
      secs = secs % 60
      this.orderDetails['timeLeft'] = ("0" + minutes).slice(-2) + ":" + ("0" + secs).slice(-2)
    }

  }

  /**
   * Method that makes api call to reject order
   */
  rejectOrder() {const dialogRef = this.dialog.open(RejectOrderDialogComponent, {
      data: {
        action: 'reject'
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          accept: false,
          reason: response.reason
        }
        this.myOrderService.sendOrderAcceptanceStatus(this.orderDetails.orderId, data).subscribe(res => {
          this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} is declined successfully`);
          this.sharedService.orderActionEventEmitter.emit('reject');
          this.closeModal();
        })
      }
    })
  }

  /**
   * Method that makes api call to cancel the order after vendors has accepted it
   */
  cancelOrder() {
    const dialogRef = this.dialog.open(RejectOrderDialogComponent, {
      data: {
        action: 'cancel'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          cancellation_reason: response.reason
        }
        this.myOrderService.postCancelOrder(this.orderDetails.orderId, data).subscribe(res => {
          this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} is cancelled successfully`);
          this.sharedService.orderActionEventEmitter.emit('cancel');
          this.closeModal();
        })
      }
    })
  }

  /**
   * Method that makes api call to accepts the order
   */
  acceptOrder() {
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      data: {
        action: 'accept',
        defaultPrepTime: this.orderDetails.preparationTimeInMilliSecs / 60000, // converting milli secs to mins
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          accept: true,
          preparation_time: response.preparationTime,
          use_sponsored_rider: response.useSponsoredRider
        }
        this.myOrderService.sendOrderAcceptanceStatus(this.orderDetails.orderId, data).subscribe(res => {
          this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} is accepted successfully`);
          this.sharedService.orderActionEventEmitter.emit('accept');
          this.closeModal();
        })
      }
    })
  }

  /**
   * Method that emits value to parent component and then it 
   * makes api call to mark order as ready
   */
  markReadyOrder() {
    this.myOrderService.sendOrderReadyStatus(this.orderDetails.orderId).subscribe((res) => {
      this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} is marked ready successfully`);
      this.sharedService.orderActionEventEmitter.emit('mark ready');
      this.closeModal();
    })
  }

  toggleHelpModal() {
    this.showHelpModal = !this.showHelpModal;
  }

/**
 * Method that open invoice modal for prinitng invoice
 */
openPrintInvoiceModal(type:string){
  this.myOrderService.billType = type;
  this.showPrintInvoiceModal = !this.showPrintInvoiceModal;
}
  ngOnDestroy(): void {
    this.showPrintInvoiceModal = false;
    this.renderer.removeClass(document.body, 'overlay-enabled');
    clearInterval(this.interval);
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

}
