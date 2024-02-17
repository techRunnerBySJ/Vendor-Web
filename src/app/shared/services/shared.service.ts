import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Outlet } from 'src/app/modules/home/model/home';
import { OrderAction } from 'src/app/modules/my-orders/model/order';
import { HomeService } from './home.service';
import { ToastService } from './toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingYourConfirmationOrderAction } from 'src/app/modules/inquiry-orders/model/inquiry-orders';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  // Order-details Modal
  orderActionEventEmitter: EventEmitter<OrderAction> = new EventEmitter<OrderAction>();
  showOrderDetailsModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  orderId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  showInquiryOrderDetailsModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  inquiryOrderId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  resetData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  openedFrom$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  pendingYourConfirmationOrderActionEventEmitter: EventEmitter<PendingYourConfirmationOrderAction> = new EventEmitter<PendingYourConfirmationOrderAction>();

  constructor(private homeService: HomeService) { }

  /**
   * Method that returns posid
   * @returns
   */
  isPosOutlet(): string {
    if (this.homeService.outletDetails.has(localStorage.getItem('childOutletId') || 'primaryOutlet')) {
      return this.homeService.outletDetails.get(localStorage.getItem('childOutletId') || 'primaryOutlet').posId
    }
  }

  /**
   * Method that sets values of behaviourSubject for order details modal 
   * @param flag
   * @param orderId
   */
  setOrderDetailsModal(flag: boolean, orderId?: number) {
    this.showOrderDetailsModal$.next(flag);
    this.orderId$.next(orderId);
  }

  /**
   * Method that sets values of behaviourSubject for order details modal 
   * @param flag
   * @param orderId
   * @param openedFrom
   */
  setInquiryOrderDetailsModal(flag: boolean, inquiryOrderId?: number, openedFrom?:string) {
    this.showInquiryOrderDetailsModal$.next(flag);
    this.inquiryOrderId$.next(inquiryOrderId);
    this.openedFrom$.next(openedFrom);
  }

}
