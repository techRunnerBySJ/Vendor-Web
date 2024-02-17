import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { MyOrdersService } from 'src/app/shared/services/my-orders.service'
import { HomeService } from 'src/app/shared/services/home.service'
import { SharedService } from 'src/app/shared/services/shared.service'
import { InquiryOrderService } from 'src/app/shared/services/inquiry-order.service'
import { InquiryOrders, PendingYourConfirmationOrderAction } from './model/inquiry-orders'
import { Services } from 'src/app/shared/models'
import { Order, OrderAction } from '../my-orders/model/order'
import {
  ISocketEventEmitter,
  Outlet,
  SocketOrderDetails
} from '../home/model/home'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component'
import { ToastService } from 'src/app/shared/services/toast.service'

@Component({
  selector: 'app-inquiry-orders',
  templateUrl: './inquiry-orders.component.html',
  styleUrls: ['./inquiry-orders.component.scss']
})
export class InquiryOrdersComponent implements OnInit {
  isPreparingOrdersTab: boolean
  isConfirmingOrdersTab: boolean = true
  isNewOrdersTab: boolean = true
  isInTransitOrdersTab: boolean
  pendingYourConfirmationOrdersList: InquiryOrders[]
  pendingCustomerConfirmationOrdersList: InquiryOrders[] = []
  newOrdersList: Order[] = []
  showNewConfirmationOrders: boolean
  showNewOrders: boolean
  preparingOrdersList: Order[] = []
  inTransitOrdersList: Order[] = []
  currentNewOrdersPage: number = 1
  subscriptions: Subscription[] = []
  vendorConfirmationTimerInterval: any
  acceptanceTimerInterval: any
  totalPendingConfirmationOrders: number
  totalCustomerPendingConfirmationOrders: number
  currentTime: Date
  service: string
  readonly Services = Services
  totalNewOrders: number
  currentPreparingOrdersPage: number = 1
  currentInTransitOrdersPage: number = 1
  outletDetails: Outlet = new Outlet()
  preparingTimerInterval: any
  totalPreparingOrders: number
  totalInTransitOrders: number
  inquiryOrderDetails: InquiryOrders
  interval: any
  openedFrom: string
  currentPendingYourConfirmationPage: number = 1
  currentPendingCustomerConfirmationPage: number = 1

  constructor (
    private homeService: HomeService,
    private inquiryOrderService: InquiryOrderService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private myordersService: MyOrdersService,
    private toastMsgService: ToastService
  ) {
    this.sharedService.openedFrom$.subscribe(openedFrom => {
      this.openedFrom = openedFrom
    })
  }

  ngOnInit (): void {
    this.getPendingYourConfirmationOrdersData();
    this.getPendingCustomerConfirmationOrdersData();
    this.service = this.inquiryOrderService.service;
    this.playAudio();
    this.socketEventListner();
    this.orderActionEventListener();
    this.getNewOrdersData();
    this.getPreparingOrdersData();
    this.getInTransitOrdersData();
    this.getCancellationReasonsList();
  }

  /**
   * Method that gets pending vendor  confirmation orders
   */
  getPendingYourConfirmationOrdersData () {
    const data = {
      filter: {
        status: ['customer_created']
      },
      pagination: {
        page_index: this.currentPendingYourConfirmationPage - 1,
        page_size: 200
      }
    }
    this.inquiryOrderService.postInquiryOrdersFilter(data).subscribe(res => {
      clearInterval(this.vendorConfirmationTimerInterval)
      this.totalPendingConfirmationOrders = res['result']['total_records']
      this.pendingYourConfirmationOrdersList = []
      for (const i of res['result']['records']) {
        this.pendingYourConfirmationOrdersList.push(InquiryOrders.fromJson(i))
        this.homeService.addInquireOrderToPlayNotificationSound(i['id']);
      }
      this.setConfirmationTimerInterval()
      this.homeService.setNewInquireOrderNotificationSoundInterval();
    })
  }

  /**
   * Method that gets pending confirmation orders
   */
  getPendingCustomerConfirmationOrdersData () {
    const data = {
      filter: {
        status: ['vendor_accepted', 'vendor_modified']
      },
      pagination: {
        page_index: this.currentPendingCustomerConfirmationPage - 1,
        page_size: 200
      }
    }
    this.inquiryOrderService.postInquiryOrdersFilter(data).subscribe(res => {
      this.totalCustomerPendingConfirmationOrders =
        res['result']['total_records'];
      this.pendingCustomerConfirmationOrdersList = []
      for (const i of res['result']['records']) {
        this.pendingCustomerConfirmationOrdersList.push(
          InquiryOrders.fromJson(i)
        )
      }
    })
  }

  /**
   * Method that set timer interval to update acceptance timer
   */
  setAcceptanceTimerInterval () {
    this.acceptanceTimerInterval = setInterval(() => {
      this.updateAcceptanceTimer()
    }, 1000)
  }

  /**
   * Method that set timer interval to update vendor confirmation timer
   */
  setConfirmationTimerInterval () {
    this.vendorConfirmationTimerInterval = setInterval(() => {
      this.updateConfirmationOrderTimer()
    }, 1000)
  }
  /**
   * Method that update order-acceptance-timer for vendor of each new-order
   * @returns
   */
  updateAcceptanceTimer() {
    for (const i of this.newOrdersList) {
      this.currentTime = new Date();
      let secs = Math.floor(
        (i['timerEndTime'].getTime() - this.currentTime.getTime()) / 1000
      );
      if (secs <= 0) {
        i['isTimerDanger'] = true;
        i['progressbarWidth'] = 0.5;
        i['timeLeft'] = 'Waiting to Accept';
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
  /**
   * Method that update order-preparation-timer for vendor of each preparing-order
   */
  updatePreparationTimer () {
    for (const i of this.preparingOrdersList) {
      const currentTime = new Date()
      let secs = Math.floor(
        (i['preparationTimerEndTime'].getTime() - currentTime.getTime()) / 1000
      )
      if (secs <= 0) {
        i['isTimerDanger'] = true
        i['progressbarWidth'] = 0.5
        i['preparationTimeLeft'] = 'Delayed Order'
      } else {
        i['progressbarWidth'] =
          secs * (100 / (i['preparationTimeInMilliSecs'] / 1000))

        if (i['progressbarWidth'] <= 50) {
          i['isTimerAlert'] = true
        }
        if (i['progressbarWidth'] <= 20) {
          i['isTimerAlert'] = false
          i['isTimerDanger'] = true
        }
        let minutes = Math.floor(secs / 60)
        secs = secs % 60
        i['preparationTimeLeft'] = `Preparing in ${('0' + minutes).slice(
          -2
        )}:${('0' + secs).slice(-2)}`
      }
    }
  }

  /**
   * Method that opens order-details modal
   * @param orderId
   */
  openInquiryOrderDetailsModal (inquiryOrderId: number, openedFrom: string) {
    this.defuseNotificationSoundForInquiryOrderId(inquiryOrderId);
    this.sharedService.setInquiryOrderDetailsModal(true, inquiryOrderId, openedFrom);
  }

  /**
   * to tackle new order sound not playing when tab is minimised before any sound play
   */
  playAudio () {
    const userGestureAudio = new Audio('assets/Notification.mp3')
    userGestureAudio.muted = true
    userGestureAudio.play().catch(error => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message:
            'For receiving notifications sound kindly click anywhere on the page !!!',
          confirmBtnText: 'OK',
          alert: true
        }
      })
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          userGestureAudio.play()
        }
      })
    })
  }

  /**
   * Method that gets new-orders list of restaurant
   */
  getNewOrdersData () {
    const data = {
      filter: {
        order_acceptance_status: ['pending'],
        order_status: ['placed']
      },
      pagination: {
        page_index: this.currentNewOrdersPage - 1,
        page_size: 50
      },
      sort: [
        {
          column: 'created_at',
          order: 'desc'
        }
      ]
    }
    this.subscriptions.push(
      this.myordersService.getOrdersData(data).subscribe(res => {
        clearInterval(this.acceptanceTimerInterval)
        clearInterval(this.homeService.newOrderNotificationSoundInterval)
        this.totalNewOrders = res['result']['total_records']
        this.newOrdersList = []
        for (const i of res['result']['records']) {
          this.newOrdersList.push(Order.fromJson(i))
          this.homeService.addOrderToPlayNotificationSound(i['order_id']);
        }
        this.setAcceptanceTimerInterval()
        this.homeService.setNewOrderNotificationSoundInterval();

      })
    )
  }

  /**
   * Method that listens to socketEventEmiiter and takes action accordingly
   */
  socketEventListner () {
    this.subscriptions.push(
      this.homeService.socketEventEmitter.subscribe(
        (event: ISocketEventEmitter) => {
          const socketData: SocketOrderDetails = event.socketData
          // socket event on new-order for restaurant,
          if (event.type === 'ORDER_PLACED') {
            this.getNewOrdersData();
            this.getPendingCustomerConfirmationOrdersData();
          }
          if (event.type === 'NEW_ORDER_INQUIRY') {
            this.getPendingYourConfirmationOrdersData();
          }
          // socket event for shadowfax order-status
          else if (event.type === 'DELIVERY_ORDER_STATUS') {
            if (
              socketData.deliveryStatus === 'allocated' ||
              socketData.deliveryStatus === 'arrived'
            ) {
              const index = this.preparingOrdersList.findIndex(
                order => order.orderId === socketData.orderId
              )
              if (index >= 0) {
                this.preparingOrdersList[index]['pickupETA'] =
                  socketData['pickupETA']
                this.preparingOrdersList[index]['dropETA'] =
                  socketData['dropETA']
                this.preparingOrdersList[index]['riderName'] =
                  socketData['riderName']
                this.preparingOrdersList[index]['riderContact'] =
                  socketData['riderContact']
                this.preparingOrdersList[index]['deliveryStatus'] =
                  socketData['deliveryStatus']
              }
              const msg =
                socketData.deliveryStatus === 'allocated'
                  ? `Order Id: ${socketData.orderId} has been allocated to rider`
                  : `Rider has arrived for Order Id: ${socketData.orderId}`
              this.toastMsgService.showInfo(
                msg,
                `Rider ${socketData.deliveryStatus} for the order`,
                {
                  timeOut: 7000
                }
              )
            } else if (socketData.deliveryStatus === 'dispatched') {
              this.checkAndResetOrdersCurrentPage('preparing')
              this.getPreparingOrdersData()
              this.getInTransitOrdersData()
              this.toastMsgService.showInfo(
                `Order ID: ${socketData.orderId} is picked up by Rider`,
                'Rider picked up the order',
                {
                  timeOut: 7000
                }
              )
            } else if (
              socketData.deliveryStatus === 'arrived_customer_doorstep'
            ) {
              const index = this.inTransitOrdersList.findIndex(
                order => order.orderId === socketData.orderId
              )
              if (index >= 0) {
                this.inTransitOrdersList[index]['deliveryStatus'] =
                  socketData['deliveryStatus']
              }
            } else if (socketData.deliveryStatus === 'delivered') {
              this.checkAndResetOrdersCurrentPage('inTransit')
              this.getInTransitOrdersData()
              this.toastMsgService.showInfo(
                `Order ID: ${socketData.orderId} is delivered by Rider`,
                'Rider delivered the order',
                {
                  timeOut: 7000
                }
              )
            } else if (socketData.deliveryStatus === 'cancelled') {
              this.checkAndResetOrdersCurrentPage('preparing')
              this.getPreparingOrdersData()
              this.checkAndResetOrdersCurrentPage('inTransit')
              this.getInTransitOrdersData()
              this.toastMsgService.showInfo(
                `Order ID: ${socketData.orderId} is cancelled by Rider`,
                'Rider cancelled the order',
                {
                  timeOut: 7000
                }
              )
            }
          } else if (event.type === 'DELIVERY_RIDER_STATUS') {
            if (
              ['accepted', 'allocated', 'arrived'].includes(
                socketData.deliveryStatus
              )
            ) {
              const index = this.preparingOrdersList.findIndex(
                order => order.orderId === Number(socketData.orderId)
              )
              if (index >= 0) {
                this.preparingOrdersList[index]['pickupETA'] =
                  socketData['pickupETA']
                this.preparingOrdersList[index]['dropETA'] =
                  socketData['dropETA']
              }
            }
          }
          // socket event for cancelled orders
          else if (event.type === 'ORDER_CANCELLED') {
            if (
              socketData.orderAcceptanceStatus === 'pending' &&
              socketData.deliveryStatus === 'pending'
            ) {
              this.checkAndResetOrdersCurrentPage('new')
              this.getNewOrdersData()
            } else if (socketData.orderAcceptanceStatus === 'accepted') {
              this.checkAndResetOrdersCurrentPage('preparing')
              this.getPreparingOrdersData()
              this.checkAndResetOrdersCurrentPage('inTransit')
              this.getInTransitOrdersData()
            }
          }
        }
      )
    )
  }

  /**
   * Method that gets preparing-orders list of restaurant
   */
  getPreparingOrdersData () {
    const data = {
      filter: {
        order_acceptance_status: ['accepted'],
        delivery_status: [
          'pending',
          'accepted',
          'rejected',
          'allocated',
          'arrived'
        ],
        order_status: ['placed']
      },
      pagination: {
        page_index: this.currentPreparingOrdersPage - 1,
        page_size: 20
      },
      sort: [
        {
          column: 'vendor_accepted_time',
          order: 'desc'
        }
      ]
    }

    this.subscriptions.push(
      this.myordersService.getOrdersData(data).subscribe(res => {
        clearInterval(this.preparingTimerInterval)
        this.totalPreparingOrders = res['result']['total_records']
        this.preparingOrdersList = []
        for (const i of res['result']['records']) {
          this.preparingOrdersList.push(Order.fromJson(i))
        }
        this.setPreparingTimerInterval();
      })
    )
  }

  /**
   * Method that gets inTransit-orders list of restaurant
   */
  getInTransitOrdersData () {
    const data = {
      filter: {
        order_acceptance_status: ['accepted'],
        delivery_status: ['dispatched', 'arrived_customer_doorstep'],
        order_status: ['placed']
      },
      pagination: {
        page_index: this.currentInTransitOrdersPage - 1,
        page_size: 50
      },
      sort: [
        {
          column: 'created_at',
          order: 'desc'
        }
      ]
    }

    this.subscriptions.push(
      this.myordersService.getOrdersData(data).subscribe(res => {
        this.totalInTransitOrders = res['result']['total_records']
        this.inTransitOrdersList = []
        for (const i of res['result']['records']) {
          this.inTransitOrdersList.push(Order.fromJson(i))
        }
      })
    )
  }

  /**
   * Method that reduce the current page index by 1
   * if codition is satisfied
   * will be used when order is not going to be part of that page after some action is performed on that order
   * @param pageType
   */
  checkAndResetOrdersCurrentPage (pageType: 'new' | 'preparing' | 'inTransit' | 'pendingYourConfirmation' | 'pendingCustomerConfirmation') {
    if (
      pageType === 'new' &&
      this.newOrdersList.length === 1 &&
      this.currentNewOrdersPage > 1
    ) {
      this.currentNewOrdersPage -= 1
    }
    if (
      pageType === 'preparing' &&
      this.preparingOrdersList.length === 1 &&
      this.currentPreparingOrdersPage > 1
    ) {
      this.currentPreparingOrdersPage -= 1
    }
    if (
      pageType === 'inTransit' &&
      this.inTransitOrdersList.length === 1 &&
      this.currentInTransitOrdersPage > 1
    ) {
      this.currentInTransitOrdersPage -= 1
    }
    if (
      pageType === 'pendingYourConfirmation' &&
      this.pendingYourConfirmationOrdersList.length === 1 &&
      this.currentPendingYourConfirmationPage > 1
    ) {
      this.currentPendingYourConfirmationPage -= 1
    }
    if (
      pageType === 'pendingCustomerConfirmation' &&
      this.pendingCustomerConfirmationOrdersList.length === 1 &&
      this.currentPendingCustomerConfirmationPage > 1
    ) {
      this.currentPendingCustomerConfirmationPage -= 1
    }
  }
  /**
   * Method that set timer to update preparing timer
   */
  setPreparingTimerInterval () {
    this.preparingTimerInterval = setInterval(() => {
      this.updatePreparationTimer()
    }, 1000)
  }

  /**
   * Method that take action based on event emiited
   */
  orderActionEventListener () {
    this.subscriptions.push(
      this.sharedService.orderActionEventEmitter.subscribe(
        (action: OrderAction) => {
          if (action === 'accept') {
            this.checkAndResetOrdersCurrentPage('new')
            this.getNewOrdersData()
            this.getPreparingOrdersData()
          }
          if (action === 'reject') {
            this.checkAndResetOrdersCurrentPage('new')
            this.getNewOrdersData()
          }
          if (action === 'mark ready') {
            this.getPreparingOrdersData()
          }
        }
      )
    )
    this.subscriptions.push(
      this.sharedService.pendingYourConfirmationOrderActionEventEmitter.subscribe(
        (action: PendingYourConfirmationOrderAction) => {
          if (action === 'confirm') {
            this.checkAndResetOrdersCurrentPage('pendingYourConfirmation')
            this.getPendingYourConfirmationOrdersData()
            this.getPendingCustomerConfirmationOrdersData()
          }
          if (action === 'reject') {
            this.checkAndResetOrdersCurrentPage('pendingYourConfirmation')
            this.getPendingYourConfirmationOrdersData()
          }
        }
      )
    )
  }

   /**
   * Method that sends order-ready status
   * @param order
   */
   markReadyOrder(order: Order) {
    this.subscriptions.push(
      this.myordersService
        .sendOrderReadyStatus(order.orderId)
        .subscribe((res) => {
          order['orderMarkedReadyTime'] = new Date(
            res['result']['vendor_ready_marked_time']
          );
          this.toastMsgService.showSuccess(
            `Order ID: ${order.orderId} is marked ready successfully`
          );
        })
    );
  }

  /**
   * Method that gets all cancellation reasons for vendor
   */
  getCancellationReasonsList () {
    this.subscriptions.push(
      this.myordersService.getCancellationReasons().subscribe()
    )
  }

  /**
   * Method that returns whether to show icon or not
   * @param orderId
   * @returns
   */
  showNotificationSoundOnIcon (orderId: number) {
    return this.homeService.playNotificationSoundForNewOrderIds[orderId]
  }

  /**
   * Method that returns whether to show icon or not
   * @param orderId
   * @returns
   */
  showInquiryOrderNotificationSoundOnIcon (inquiryOrderId: number) {
    return this.homeService.playNotificationSoundForNewInquireOrderIds[inquiryOrderId]
  }
  /**
   * Method that opens order-details modal
   * @param orderId
   */
  openOrderDetailsModal (orderId: number) {
    this.defuseNotificationSoundForOrderId(orderId)
    this.sharedService.setOrderDetailsModal(true, orderId)
  }

  /**
   * Method that sets value to false for orderId and by that notification sound won't play for that order id
   * @param orderId
   */
  defuseNotificationSoundForOrderId (orderId: number) {
    this.homeService.playNotificationSoundForNewOrderIds[orderId] = false
  }

    /**
   * Method that sets value to false for orderId and by that notification sound won't play for that order id
   * @param orderId
   */
  defuseNotificationSoundForInquiryOrderId (inquiryOrderId: number) {
      this.homeService.playNotificationSoundForNewInquireOrderIds[inquiryOrderId] = false
    }

  /**
   * Method that update vendor confirmation order timer
   */
  updateConfirmationOrderTimer () {
    for (const i of this.pendingYourConfirmationOrdersList) {
      this.currentTime = new Date()
      let secs = Math.floor(
        (i['timerEndTime'].getTime() - this.currentTime.getTime()) / 1000
      )
      if (secs <= 0) {
        i['isTimerDanger'] = true
        i['progressbarWidth'] = 0.5
        i['timeLeft'] = 'Waiting for Confirmation'
      } else {
        i['progressbarWidth'] =
          secs * (100 / (i['vendorConfirmationTimeInMilliSecs'] / 1000))

        if (i['progressbarWidth'] <= 50) {
          i['isTimerAlert'] = true
        }
        if (i['progressbarWidth'] <= 20) {
          i['isTimerAlert'] = false
          i['isTimerDanger'] = true
        }
        let minutes = Math.floor(secs / 60)
        secs = secs % 60
        i['timeLeft'] = ('0' + minutes).slice(-2) + ':' + ('0' + secs).slice(-2)
      }
    }
  }
  ngOnDestroy () {
    clearInterval(this.interval)
  }
}
