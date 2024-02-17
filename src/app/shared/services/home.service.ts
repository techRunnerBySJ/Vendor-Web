import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, retry } from 'rxjs/operators';
import { Socket, connect } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import * as apiUrls from 'src/app/core/apiUrls';
import { apiEndPoints, Role } from '../models/constants/constant.type';
import jwt_decode from 'jwt-decode';

import {
  Subscription,
  SubscriptionStatus,
} from 'src/app/modules/subscription/model/subscription';
import {
  ISocketEventEmitter,
  Outlet,
  SocketEventTypes,
  SocketOrderDetails,
} from 'src/app/modules/home/model/home';
import { ToastService } from './toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  outletDetails: Map<string, Outlet> = new Map<string, Outlet>();
  outletDetails$: BehaviorSubject<Map<string, Outlet>> = new BehaviorSubject<Map<string, Outlet>>(null);
  currentSubscription$: BehaviorSubject<Subscription> = new BehaviorSubject(
    null
  );
  globalVar: Map<string, any> = new Map<string, any>();
  role: Role;
  service$: BehaviorSubject<string> = new BehaviorSubject(null);
  service: string;
  socket: Socket;
  socketEventEmitter: EventEmitter<ISocketEventEmitter> =
    new EventEmitter<ISocketEventEmitter>();
  newOrderAlert: any;
  cancelledOrderAlert: any;
  newOrderNotificationSoundInterval: any; //for setInterval in my-orders
  cancelledOrderNotificationSoundInterval: any;
  playNotificationSoundForNewOrderIds: { [key: number]: boolean } = {}; // for notification sound in my-orders
  playNotificationSoundForCancelledOrderIds: { [key: number]: boolean } = {};
  errorCaught: boolean;
  showNotifcationSoundIcon: boolean;
  newInquireOrderAlert: any;
  newInquireOrderNotificationSoundInterval: any;
  playNotificationSoundForNewInquireOrderIds: { [key: number]: boolean} = {};
  // error$ = new Subject<any>();
  constructor(
    private http: HttpClient,
    private toastMsgService: ToastService,
    private dialog: MatDialog,
    private loginService: LoginService
  ) {
    this.service$.subscribe((data) => (this.service = data));
    // this.error$
    //   .pipe(
    //     debounceTime(10000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(error => {
    //     this.createLog(error).subscribe();
    //   });
  }

  /**
   * Method that gets outlet details
   * @returns
   */
  getOutletDetails(childOutletId?: string): Observable<any> {
    const headers = new HttpHeaders({
      child_outlet_id: childOutletId || ''
    });
    return this.http
      .get(apiUrls.getOutletDetailsEndPoint(apiEndPoints[this.service]), { headers })
      .pipe(
        map((response) => {
          this.outletDetails.set(childOutletId || 'primaryOutlet', Outlet.fromJson(response['result'][0], this.service));
          this.outletDetails$.next(this.outletDetails);
        })
      );
  }

  /**
   * Mehod that filter subscriptions
   * @param data
   * @returns response
   */

  filterSubscriptions(): Observable<any> {
    const possibleCurrentSubscriptionStatus: SubscriptionStatus[] = [
      'active',
      'initialized',
      'on_hold',
      'bank_approval_pending',
    ];
    const data = {
      filter: {
        status: possibleCurrentSubscriptionStatus,
        include_grace_period_subscription: true,
      },
    };
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http
      .post(
        apiUrls.postFilterSubcriptionsEndPoint(apiEndPoints[this.service]),
        data,
        { headers }
      )
      .pipe(
        map((response) => {
          let subsData: Subscription;
          if (response['result']['records'].length)
            subsData = Subscription.fromJson(response['result']['records'][0]);

          this.currentSubscription$.next(subsData);
        })
      );
  }

  /**
   * Method that updates outlet details like image and prep time
   * @param data
   * @returns
   */
  updateOutletDetails(data: any): Observable<any> {
    return this.http
      .put(apiUrls.putOutletDetailsEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that put outlet on a holiday slot
   * @param data
   * @returns
   */
  addOutletHolidaySlot(data: any, childOutletId: string): Observable<any> {
    let headers = new HttpHeaders({
      child_outlet_id: childOutletId
    });
    return this.http
      .post(
        apiUrls.postOutletHolidaySlotEndPoint(apiEndPoints[this.service]),
        data,
        { headers }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that removes outlet from holiday slot
   * @returns
   */
  deleteOutletHolidaySlot(childOutletId: string): Observable<any> {
    let headers = new HttpHeaders({
      child_outlet_id: childOutletId
    });
    return this.http
      .delete(
        apiUrls.deleteOutletHolidaySlotEndPoint(apiEndPoints[this.service]),
        { headers }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that filters notifications data
   * based on parameter
   * @param data
   * @returns
   */
  getPushNotifications(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postFilterPushNotificationsEndPoint, data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that change notification read status
   * @param data
   * @returns
   */
  changePushNotificationStatus(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postChangePushNotificationReadStatusEndPoint, data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets all global vars for vendor and sets
   * all with key value pair in BehaviourSubject
   * @returns
   */
  getGlobalVar(): Observable<any> {
    return this.http
      .get(apiUrls.getGlobalVarEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          for (const i of response['result']) {
            this.globalVar.set(i['key'], i['value']);
          }
        })
      );
  }

  /**
   * Method that gets all child outlets
   * @returns 
   */
  getAllChildOutlets(): Observable<any> {
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http.get(apiUrls.getChildOutletsEndPoint(apiEndPoints[this.service]), { headers }).pipe(
      map(response => {
        for (const i of response['result']) {
          this.outletDetails.set(i['id'], Outlet.fromJson(i, this.service));
        }
        this.outletDetails$.next(this.outletDetails);
        return response;
      })
    )
  }

  /**
   * Method that initialize socket connection
   */
  openWsConnection() {
    this.socket = connect(environment.baseUrl, {
      path: '/ws/socket.io',
      withCredentials: true,
      auth: { token: localStorage.getItem('token') },
    });

    this.socket.on('connect', () => {
      console.log('connection esstablished')
      this.socket.emit('online');
    });

    this.socket.on("connect_error", (error) => {
      console.log('connect_error', error.message);
      // this.error$.next(error)
      if (error.message.includes('forbidden')) {
        this.loginService.refreshAuthToken().subscribe(() => {
          this.socket.auth = { token: localStorage.getItem('token') }
          this.socket.connect();
        })
      }

    });

    this.socket.on('user_details', (data) => { console.log(data) });

    this.socket.on('ORDER_PLACED', (data) => {
      clearInterval(this.newOrderNotificationSoundInterval);
      this.addOrderToPlayNotificationSound(data['order_id']);
      this.setNewOrderNotificationSoundInterval();
      this.emitSocketEvent('ORDER_PLACED');
    });

    this.socket.on('DELIVERY_ORDER_STATUS', (data) => {
      this.emitSocketEvent('DELIVERY_ORDER_STATUS', data);
    });

    this.socket.on('DELIVERY_RIDER_STATUS', (data) => {
      this.emitSocketEvent('DELIVERY_RIDER_STATUS', data);
    });

    this.socket.on('RIDER_ORDER_REJECTED',(data) => {
      this.emitSocketEvent('RIDER_ORDER_REJECTED', data);
    });

    this.socket.on('RIDER_ORDER_IGNORED', (data) => {
      this.emitSocketEvent('RIDER_ORDER_IGNORED', data);
    });

    this.socket.on('RIDER_ORDER_ACCEPTED', (data) => {
      this.emitSocketEvent('RIDER_ORDER_ACCEPTED', data);
    });

    this.socket.on('ORDER_CANCELLED', (data) => {
      clearInterval(this.cancelledOrderNotificationSoundInterval);
      this.playNotificationSoundForNewOrderIds[data['order_id']] = false;
      this.showCancelledOrderDialog(data['order_id'], data['cancelled_by']);
      this.setCancelledOrderNotificationSoundInterval();
      this.emitSocketEvent('ORDER_CANCELLED', data);
    });
    this.socket.on('NEW_ORDER_INQUIRY', (data) => {
      clearInterval(this.newInquireOrderNotificationSoundInterval);
      this.playNotificationSoundForNewInquireOrderIds[data['inquiry_order_data']['inquiry_order_id']] = true;
      this.addInquireOrderToPlayNotificationSound(data['inquiry_order_data']['inquiry_order_id']);
      this.setNewInquireOrderNotificationSoundInterval();
      this.emitSocketEvent('NEW_ORDER_INQUIRY', data);
    });
  }

  /**
   * Method that emits socket data
   * @param type
   * @param data
   */
  emitSocketEvent(type: SocketEventTypes, data?: any) {
    let socketData: SocketOrderDetails;
    if (data) socketData = SocketOrderDetails.fromJson(data);
    this.socketEventEmitter.emit({ type, socketData });
  }

  /**
   * Method that closes socket connection
   */
  closeWsConnection() {
    this.socket.disconnect();
  }

  // Notification Sound for New Orders

  /**
   * Method that plays notification sound for each order id if the value is true
   */
  bombardNotificationSound() {
    const count = Object.values(
      this.playNotificationSoundForNewOrderIds
    ).filter((a) => a === true).length;
    if (count) {
      this.newOrderAlert.play().catch((error) => {
        if (!this.errorCaught) {
          this.errorCaught = true;
          this.dialogBoxForRecievingConsent(
            'For receiving notifications sound kindly click anywhere on the page !!!'
          );
        }
      });
      this.showNotifcationSoundIcon = true;
    } else {
      this.newOrderAlert.pause();
      this.showNotifcationSoundIcon = false;
      clearInterval(this.newOrderNotificationSoundInterval);
    }
  }

  /**
   * Method that will add order to 'playNotificationSoundForOrderIds' object
   * @param orderId
   */
  addOrderToPlayNotificationSound(orderId: number) {
    if (this.playNotificationSoundForNewOrderIds[orderId] === undefined) {
      this.playNotificationSoundForNewOrderIds[orderId] =
        !this.playNotificationSoundForNewOrderIds[orderId];
    }
  }

    /**
   * Method that will add order to 'playNotificationSoundForInquiryOrderIds' object
   * @param orderId
   */
  addInquireOrderToPlayNotificationSound(inquiryOrderId: number) {
    if (this.playNotificationSoundForNewInquireOrderIds[inquiryOrderId] === undefined) {
      this.playNotificationSoundForNewInquireOrderIds[inquiryOrderId] =
      !this.playNotificationSoundForNewInquireOrderIds[inquiryOrderId];    }
  }

  /**
   * Method that set timer to play notification sound
   */
  setNewOrderNotificationSoundInterval() {
    this.newOrderAlert?.pause();
    this.newOrderAlert = new Audio(
      this.globalVar.get('NEW_ORDER_NOTIFICATION_SOUND')
    );
    this.newOrderNotificationSoundInterval = setInterval(() => {
      this.bombardNotificationSound();
    }, 1200);
  }
  /**
   * Method that set timer to play notification sound
   */
  setNewInquireOrderNotificationSoundInterval() {
    this.newInquireOrderAlert?.pause();
    this.newInquireOrderAlert = new Audio(
      this.globalVar.get('NEW_ORDER_NOTIFICATION_SOUND')
    );
    this.newInquireOrderNotificationSoundInterval = setInterval(() => {
      this.bombardInquireOrderNotificationSound();
    }, 1200);
  }

  bombardInquireOrderNotificationSound() {
    const count = Object.values(
      this.playNotificationSoundForNewInquireOrderIds
    ).filter((a) => a === true).length;
    if (count) {
      this.newInquireOrderAlert.play().catch((error) => {
        if (!this.errorCaught) {
          this.errorCaught = true;
          // this.dialogBoxForRecievingConsent(
          //   'For receiving notifications sound kindly click anywhere on the page !!!'
          // );
          console.log('error occured while playing sound for inquiry order');
        }
      });
      this.showNotifcationSoundIcon = true;
    } else {
      this.newInquireOrderAlert.pause();
      this.showNotifcationSoundIcon = false;
      clearInterval(this.newInquireOrderNotificationSoundInterval);
    }
  }
  showCancelledOrderDialog(orderId: number, cancelledBy: string) {
    this.playNotificationSoundForCancelledOrderIds[orderId] = true;
    this.dialogBoxForRecievingConsent(
      `Order ID: ${orderId} is cancelled by ${cancelledBy}`,
      orderId
    );
  }

  /**
   * Method that set timer to play notification sound
   */
  setCancelledOrderNotificationSoundInterval() {
    this.cancelledOrderAlert?.pause();
    this.cancelledOrderAlert = new Audio(
      this.globalVar.get('ORDER_CANCELLED_NOTIFICATION_SOUND')
    );
    this.cancelledOrderNotificationSoundInterval = setInterval(() => {
      this.bombardCancelledOrderNotificationSound();
    }, 1200);
  }

  /**
   * Method that plays notification sound for each order id if the value is true
   */
  bombardCancelledOrderNotificationSound() {
    const count = Object.values(
      this.playNotificationSoundForCancelledOrderIds
    ).filter((a) => a === true).length;
    if (count) {
      const newOrderCount = Object.values(this.playNotificationSoundForNewOrderIds).filter((a) => a === true).length;
      if (!newOrderCount) {
        this.cancelledOrderAlert.play().catch((error) => {
          if (!this.errorCaught) {
            this.errorCaught = true;
            this.dialogBoxForRecievingConsent(
              'For receiving notifications sound kindly click anywhere on the page !!!'
            );
          }
        });
      } 
      this.showNotifcationSoundIcon = true;
    } else {
      this.cancelledOrderAlert.pause();
      this.showNotifcationSoundIcon = false;
      clearInterval(this.cancelledOrderNotificationSoundInterval);
    }
  }

  /**
   * Method that opens dialog box for accepting consent from user for playing notification sound
   * @param message
   * @param audioPlay
   */
  dialogBoxForRecievingConsent(message?: any, orderId?: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: message,
        confirmBtnText: 'OK',
        alert: true,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        // Perform any actions needed when the confirm button is clicked
        this.playNotificationSoundForCancelledOrderIds[orderId] = false;
      }
    });
  }

  /**
   * Method that sends websocket 'connect_error' data using API
   * @param error 
   * @returns 
   */
  //  createLog(error: any): Observable<any> {
  //   const data = {};
  //   let decoded: any;
  //   if (localStorage.getItem('token')) {
  //     decoded = jwt_decode(localStorage.getItem('token'));
  //   }
  //   data['level'] = 'error';
  //   data['user_id'] = decoded?.['id'];
  //   data['user_type'] = decoded?.['user_type'];
  //   data['client_app'] = 'vendor_dashboard';
  //   data['code'] = 101;
  //   data['message'] = error['message'].substring(0, 255);
  //   data['data'] = `Error occured in Web-Socket`;
  //   return this.http.post(apiUrls.postClientLog, data).pipe(
  //     map(response => {
  //       return response;
  //     })
  //   )
  // }
}
