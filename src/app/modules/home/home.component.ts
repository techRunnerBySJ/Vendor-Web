import { ToastService } from 'src/app/shared/services/toast.service';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HomeService } from 'src/app/shared/services/home.service';
import { HolidaySlotsDialogComponent } from 'src/app/shared/components/holiday-slots-dialog/holiday-slots-dialog.component';
import { MessagingService } from 'src/app/shared/services/messaging.service';
import { Subscription } from 'rxjs';
import { INavLink, navLinks, NotificationData, Outlet, profileDropdownLinks } from './model/home';
import {
  posErrorMsg,
  Role,
  Services,
} from 'src/app/shared/models/constants/constant.type';
import * as subscriptionModels from '../subscription/model/subscription';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  navLinks: INavLink[];
  readonly profileDropdownLinks = profileDropdownLinks;
  outletDetails: Outlet = new Outlet();
  notificationList: NotificationData[] = [];
  totalNotificationRecords: number;
  showTotalNotificationRecords: boolean = true;
  currentNotificationPage: number = 0;
  notifactionPageSize: number = 10;
  userRole: Role;
  subcriptions: Subscription[] = [];
  timeoutKeeper: any;
  showOrderDetailsModal: boolean;
  showInquiryOrderDetailModal: boolean;
  currentSubscription: subscriptionModels.Subscription;
  globalVar: Map<string, any>;
  showNotificationSoundIcon: boolean;
  parentAndChildOutlets: Outlet[] = [];
  selectedOutlet: Outlet = new Outlet();
  onlineOutletsCount: number;
  offlineOutletsCount: number;
  isOnOrdersPage: boolean;
  outletOpeningTimer: string;
  showOutletOpeningTimer: boolean;
  interval: any
  service: string;
  inquiryOrderDetailModalSubscription: Subscription[] = [];
  routes = ['my-orders', 'grocery-orders'];
  constructor(
    private router: Router,
    private homeService: HomeService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private messagingService: MessagingService,
    private sharedService: SharedService,
    private activeRoute: ActivatedRoute,
  ) {
    this.service = sessionStorage.getItem('service')
    if (Object.keys(this.activeRoute.snapshot.queryParams).length) {
      const queryParams = this.activeRoute.snapshot.queryParams;
      if (queryParams.orderId) {
        this.sharedService.setOrderDetailsModal(true, queryParams.orderId)
      }
      if (queryParams.inquiryOrderId) {
        this.sharedService.setInquiryOrderDetailsModal(true, queryParams.inquiryOrderId);        
      }
    }
    this.subcriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isOnOrdersPage = this.routes.some((r)=>event.urlAfterRedirects.includes(r));
        }
      })
    )
  }

  ngOnInit() {
    this.getOutletDetails();
    this.outletDetailsChangesListern();
    this.getCurrentSubscriptionDetails();
    this.getAllPushNotificationsData();
    this.homeService.openWsConnection(); //initialize socket connection
    this.messagingService.initPushNotificationConnection();
    this.getAllGlobalVar();
    this.userRole = this.homeService.role;
    this.subcriptions.push(this.sharedService.showOrderDetailsModal$.subscribe(flag => {
      this.showOrderDetailsModal = flag;
    }))
    this.subcriptions.push(this.sharedService.showInquiryOrderDetailsModal$.subscribe(flag => {
      this.showInquiryOrderDetailModal = flag;
    }))
    this.getAllChildOutlets();
    this.setNavLinks();
  }
  /**
   * Method that get outlet details
   */
  getOutletDetails(childOutletId?: string) {
    this.subcriptions.push(
      this.homeService.getOutletDetails(childOutletId).subscribe()
    );
  }

  /**
   * Method that listens to each change in outletDetails$ var
   * and update the data accordingly
   */
  outletDetailsChangesListern() {
    this.subcriptions.push(
      this.homeService.outletDetails$.subscribe((data) => {
        if (data?.has(localStorage.getItem('childOutletId') || 'primaryOutlet')) {
          this.selectedOutlet = data.get(localStorage.getItem('childOutletId') || 'primaryOutlet')
          if (data.has('primaryOutlet')) this.outletDetails = data.get('primaryOutlet');
          if (
            this.outletDetails.isInHolidaySlot ||
            !this.outletDetails.isOpen
          ) {
            // this.updateWhenOutletOpens();
            this.checkAndStartTimer();
          }
          if (this.outletDetails.parentOrChild === 'parent') {
            if (data.size > 1) {
              this.parentAndChildOutlets = [...data.values()];
              this.onlineOutletsCount = this.parentAndChildOutlets.filter(item => item.isOpen).length;
              this.offlineOutletsCount = this.parentAndChildOutlets.length - this.onlineOutletsCount;
            }
          }
        }
      })
    );
  }

  /**
   * Method that get current subscription detail
   */
  getCurrentSubscriptionDetails() {
    this.subcriptions.push(
      this.homeService.filterSubscriptions().subscribe(() => {
        this.subcriptions.push(
          this.homeService.currentSubscription$.subscribe((data) => {
            this.currentSubscription = data;
          })
        );
      })
    );
  }

  /**
   * Method that gets all global var for vendor
   */
  getAllGlobalVar() {
    this.subcriptions.push(this.homeService.getGlobalVar().subscribe());
  }

  /**
   * Method that calls outlet api when outlet holiday slot ends or time slot starts
   */
  updateWhenOutletOpens() {
    const milliSecs =
      new Date(this.outletDetails.nextOpensAt).getTime() - new Date().getTime();
    this.timeoutKeeper = setTimeout(() => {
      this.getOutletDetails();
    }, milliSecs);
  }



  /**
   * Method that checks if restaurant next opening time is less than 3 hrs then start timer for restaurant opning time
   * or create timeOut function to start timer when it becomes less than 3 hrs
   */
   checkAndStartTimer() {
    const timeDiff =
      (new Date(this.outletDetails.nextOpensAt).getTime() -
        new Date().getTime()) /
      3600000; //converting into hrs
    if (timeDiff <= 3) {
      this.showOutletOpeningTimer = true;
      this.interval = setInterval(() => {
        let secs = Math.floor(
          (new Date(this.outletDetails.nextOpensAt).getTime() -
            new Date().getTime()) /
            1000
        );
        if (secs === 0) {
          clearInterval(this.interval);
          this.showOutletOpeningTimer = false;
          this.getOutletDetails();
        }
        let minutes = Math.floor(secs / 60);
        secs = secs % 60;
        let hrs = Math.floor(minutes / 60);
        minutes = minutes % 60;
        this.outletOpeningTimer =
          ('0' + hrs).slice(-2) +
          ' Hrs : ' +
          ('0' + (minutes + 1)).slice(-2) +
          ' Mins ';
      }, 1000);
    }
    else {
      this.showOutletOpeningTimer = false;
      clearInterval(this.interval);
      const milliSecs =
        new Date(this.outletDetails.nextOpensAt).getTime() -
        new Date().getTime() -
        10800000; // subtracting 3 hrs (10800000)
      setTimeout(() => {
        this.checkAndStartTimer();
      }, milliSecs);
    }
  }

  /**
   * Method that creates holiday slots for the outlet
   */
  createDeleteHolidaySlot(outlet?: Outlet) {
    const childOutletId = outlet?.parentOrChild === 'child' ? outlet.id : '';
    const outletDet = outlet || this.outletDetails;
    
    if (outletDet.isOpen) {
      const dialogRef = this.dialog.open(HolidaySlotsDialogComponent, {
        data: {
          openedFor: 'outlet',
        },
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response.flag) {
          const data = { end_epoch: response.endDate };
          this.subcriptions.push(
            this.homeService.addOutletHolidaySlot(data, childOutletId).subscribe((res) => {
              this.getOutletDetails(childOutletId);
              this.toastMsgService.showSuccess(
                'Outlet has been put on Holiday Slot'
              );
            })
          );
        }
      });
    } else {
      if (outletDet.holidaySlotCreatedBy === 'admin') {
        this.toastMsgService.showInfo('You are put on holiday slot by Admin');
        return;
      }
      if (!outletDet.isInHolidaySlot) {
        this.toastMsgService.showInfo(
          'oops, you are trying to open outlet oustide of your slot timings.'
        );
        return;
      }
      this.subcriptions.push(
        this.homeService.deleteOutletHolidaySlot(childOutletId).subscribe((res) => {
          this.getOutletDetails(childOutletId);
          this.toastMsgService.showSuccess(
            'Outlet has been removed from Holiday Slot'
          );
        })
      );
    }
  }

  /**
   * Method that calls API to gets notification data
   */
  getAllPushNotificationsData() {
    const data = {
      // filter: {mark_as_read: true},
      pagination: {
        page_index: this.currentNotificationPage,
        page_size: this.notifactionPageSize,
      },
    };
    this.subcriptions.push(
      this.homeService.getPushNotifications(data).subscribe((res) => {
        this.totalNotificationRecords = res['result']['total_records'];
        for (const i of res['result']['records']) {
          this.notificationList.push(NotificationData.fromJson(i));
        }
      })
    );
  }
  /**
   * Method that calls API to change read status of particular notifcation
   * @param notification
   */
  changePushNotificationReadStatus(notification: NotificationData) {
    const data = {
      push_notification_ids: [notification.id],
      mark_as_read: !notification.markAsRead,
    };

    this.subcriptions.push(
      this.homeService.changePushNotificationStatus(data).subscribe((res) => {
        notification['markAsRead'] = !notification['markAsRead'];
      })
    );
  }

  /**
   * Method that load more notifications by calling
   * getAllPushNotificationsData() method
   */
  loadMoreNotificationsData() {
    this.currentNotificationPage += 1;
    this.getAllPushNotificationsData();
  }
  /**
   * Method that reloads notifications data to get new notifications if any.
   * this method invokes on notification icon click
   */
  reloadNotificationsData() {
    this.currentNotificationPage = this.totalNotificationRecords = 0;
    this.notificationList = [];
    this.getAllPushNotificationsData();
  }

  /**
   * Method that opens order details modal and shows order-details by orderId
   * also marks notification as read if it is not already
   * @param notification
   */
  openOrderDetailsModal(notification: NotificationData) {
    if (!notification.markAsRead) {
      this.changePushNotificationReadStatus(notification);
    }
    if (notification.orderId) {
    this.sharedService.setOrderDetailsModal(true, notification.orderId);
    }
    if (notification.inquireOrderId) {
      this.sharedService.setInquiryOrderDetailsModal(true, notification.inquireOrderId);
    }
  }
  getAllChildOutlets() {
    this.homeService.getAllChildOutlets().subscribe();
  }

  /**
   * Method that invokes on outlet selection change
   * and sets childOutletId in localstorage if it exists
   * also updates the selectedOutlet value
   * @param outlet 
   */
  onOutletSelection(outlet: Outlet) {
    outlet.parentOrChild === 'child' ? localStorage.setItem('childOutletId', outlet.id) : localStorage.removeItem('childOutletId');
    this.selectedOutlet = this.homeService.outletDetails.get(localStorage.getItem('childOutletId') || 'primaryOutlet');
    this.sharedService.resetData$.next(true);
  }

  /**
   * Method that shows status of outlet
   * @param outlet 
   */
  viewOutletStatus(outlet: Outlet) {
    let message: string;
    if (outlet.isInHolidaySlot && outlet.holidaySlotCreatedBy === 'vendor') {
      message = `Holiday slot will end on ${moment(outlet.nextOpensAt).format('DD MMM y, h:mm a')}`;
    }
    if (outlet.isInHolidaySlot && outlet.holidaySlotCreatedBy === 'admin') {
      message = `Outlet is currently in Holiday slot by Admin. Will end on ${moment(outlet.nextOpensAt).format('DD MMM y, h:mm a')}`;
    }
    if (!outlet.isInHolidaySlot && !outlet.isOpen) {
      message = `Your Outlet is currently closed for business. Will open on ${moment(outlet.nextOpensAt).format('DD MMM y, h:mm a')}`;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'Ok',
        message,
        alert: 'true'
      }
    })
  }
  /**
   * Method that logs out user
   */
  logout() {
    this.subcriptions.push(
      this.messagingService.deletePushNotificationToken().subscribe((res) => {
        localStorage.clear();
        this.router.navigate(['login']);
        this.toastMsgService.showSuccess('Logout Successful');
      })
    );
  }

  /**
   * Method that sets active link
   * @param route
   * @param i
   */
  // setActiveLink(route, i) {
  //   this.step = route;
  //   this.router.navigate([route]);
  // }

  /**
   * Method that deletes notification from notificationList array
   * @param index
   */
  removeNotification(index: number) {
    this.notificationList.splice(index, 1);
  }

  /**
   * Method that navigates to subscription page
   */
  navigateToSubscriptionPage() {
    this.router.navigate(['subscription']);
  }

  /**
   * Method that shows sound notification icon in my order tab for new order
   * @returns 
   */
  showSoundNotificationIconInMyOrderTab(){
    return this.showNotificationSoundIcon = this.homeService.showNotifcationSoundIcon;
  }

  // /**
  //  * Method that starts playing notification sound when user clicks on the button
  //  */
  // startNotificationSound() {
  //   document.getElementById('start').style.display = 'none';
  //   this.homeService.playNewOrderNotificationSound = true;
  //   this.messagingService.playNewOrderNotificationSound = true;
  // }

  /**
   * Method that filters nav-links based on role and service
   */
  setNavLinks() {
    this.navLinks = navLinks.filter(link => {
      return link.allowedRouteAccessTo.service.includes(this.service as Services) &&
        link.allowedRouteAccessTo.role.some(r => this.homeService.role.includes(r));
    })
  }
  
  ngOnDestroy(): void {
    this.homeService.closeWsConnection();
    clearTimeout(this.timeoutKeeper);
    this.subcriptions.forEach((subcription) => {
      if (!subcription.closed) {
        subcription.unsubscribe();
      }
    });
    this.homeService.outletDetails.clear();
    this.homeService.outletDetails$.next(null);
    // clearing interval of notification sound for new orders here (for eg. when user log-out) instead of my-orders component
    // as we want to play notification sound for new-orders even on route change also [for eg. when user navigates to business page]
    clearInterval(this.homeService.newOrderNotificationSoundInterval);
    this.homeService.playNotificationSoundForNewOrderIds = {};

    clearInterval(this.homeService.newInquireOrderNotificationSoundInterval)
    this.homeService.playNotificationSoundForNewInquireOrderIds = {}
  }
}
