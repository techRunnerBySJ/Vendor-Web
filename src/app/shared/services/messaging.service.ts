import { BehaviorSubject, Observable } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';
import * as apiUrls from '../../core/apiUrls';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services/toast.service';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  errorCaught: boolean;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private toastMsgService: ToastService,
    private homeService: HomeService,
    private sharedService: SharedService,
    private router: Router
  ) {}
  /**
   * Method that initialises push notification connection
   */
  initPushNotificationConnection() {
    Notification.requestPermission().then((status) => {
      if (status === 'denied') {
        this.toastMsgService.showInfo(
          'For receiving notifications kindly allow Notification from browser settings. For any further assistance call customer care.',
          'Notification',
          {
            closeButton: true,
            extendedTimeOut: 0,
            timeOut: 7000,
          }
        );
        Notification.requestPermission().then((status) => {});
      } else if (status === 'granted') {
        if (!getApps().length) {
          initializeApp(environment.firebaseConfig);
        } else {
          getApp();
        }
        const messaging = getMessaging();
        getToken(messaging).then((token) => {
          const data = {
            token: token,
            device_id: this.cookieService.get('deviceId'),
            device_type: 'desktop',
          };
          this.postPushNotificationToken(data).subscribe();
        });
        onMessage(messaging, (payload) => {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.image,
            data: payload.data,
          });
          notification.addEventListener('click', (e) => {
            if (e.target['data']['order_id']) {
              this.homeService.playNotificationSoundForNewOrderIds[
                e.target['data']['order_id']
              ] = false;
              this.sharedService.setOrderDetailsModal(
                true,
                e.target['data']['order_id']
              );
            }
            if (e.target['data']['inquiry_order_id']) {
              this.homeService.playNotificationSoundForNewInquireOrderIds[
                e.target['data']['inquiry_order_id']
              ] = false;
              this.sharedService.setInquiryOrderDetailsModal(
                true,
                e.target['data']['inquiry_order_id']
              );
            }
          });
        });
      }
    });
  }
  /**
   * Method that send push notification token
   * @param data
   * @returns response
   */
  postPushNotificationToken(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postTokenForPushNotificationEndPoint, data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  /**
   * Method that delete push notification token
   * @returns response
   */
  deletePushNotificationToken(): Observable<any> {
    return this.http
      .delete(
        apiUrls.deleteTokenForPushNotificationEndPoint(
          this.cookieService.get('deviceId') || 'device-id' //sending dummy device-id in case not stored in cookie
        )
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}