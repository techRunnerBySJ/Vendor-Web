import { scaleBig } from './../../shared/animations/scale';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { ViewPointOfContactDialogComponent } from './view-point-of-contact-dialog/view-point-of-contact-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Coupon, CouponMapping, DiscountTabs, discountTypeOptions, IDiscountSequence } from './model/coupon';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BusinessService } from 'src/app/shared/services/business.service';
import { OptInDialogComponent } from './opt-in-dialog/opt-in-dialog.component';
import * as moment from 'moment';
import { PayoutStatus, PayoutSummary } from './model/payout';
import { CustomerReview } from './model/customer-reviews';
import { Subscription } from 'rxjs';
import { Duration, Sales } from './model/sales';
import { ViewDiscountDialogComponent } from './view-discount-dialog/view-discount-dialog.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { posErrorMsg } from 'src/app/shared/models';
import { DiscountSequenceDialogComponent } from './discount-sequence-dialog/discount-sequence-dialog.component';
import { skip } from 'rxjs/operators';
import { HomeService } from 'src/app/shared/services/home.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  currentTime = moment(new Date()).format('h:mm a');
  showAddnewDiscountModal: boolean;
  discountTypeOptions = discountTypeOptions;
  isUptoDiscountType: boolean;
  showCampaignUsageIntervalField: boolean;
  showOngoingDiscountOffersTab: boolean = true;
  payoutSummary: PayoutSummary = {};
  orangeStatusArray = [PayoutStatus.INIT, PayoutStatus.PENDING];
  greenStatusArray = [PayoutStatus.COMPLETE];
  redStatusArray = [
    PayoutStatus.FAILED,
    PayoutStatus.REJECTED,
    PayoutStatus.REVERSED,
  ];
  currentCustomerReviewsPage: number = 1;
  customerReviewsList: CustomerReview[] = [];
  totalCustomerReviewsCount: number;
  totalCustomerLikeCount: string;
  totalCustomerDislikeCount: string;
  subscriptions: Subscription[] = [];
  discountsData: { [key in DiscountTabs]: Coupon[] } = {
    [DiscountTabs.Ongoing]: [],
    [DiscountTabs.Upcoming]: [],
    [DiscountTabs.NewAvailable]: [],
    [DiscountTabs.Expired]: [],
  };
  currentDiscountTab: DiscountTabs = DiscountTabs.Ongoing;
  currentDiscountsPage: number = 1;
  discountTabsList = Object.values(DiscountTabs);
  readonly DiscountTabs = DiscountTabs;
  discountSequenceData: IDiscountSequence[] = [];
  salesReportList: Sales[] = [];
  salesReportStartTime: string;
  salesReportEndTime: string;
  totalSalesAmount: number;
  filterSalesReportByStartTime: Date;
  filterSalesReportByEndTime: Date;
  salesReportDurationType: Duration = 'today';
  showCustomDateFilterFields: boolean;
  isCustomDateRangeSelected: boolean;
  startTime: string;
  endTime: string;
  customerServiceContactNumber: string;

  mouseDrag = {
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  };
  @ViewChild('salesDurationSlider') salesDurationSlider: ElementRef;
  @ViewChild('discountTabSlider') discountTabSlider: ElementRef;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private businessService: BusinessService,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private homeService: HomeService
  ) {
    this.customerServiceContactNumber = this.homeService.globalVar.get('SUPPORT_CONTACT');
   }

  addNewDiscountForm = new FormGroup(
    {
      couponName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(18)]),
      couponHeader: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      couponDesc: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      termsAndConditions: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      couponStartDate: new FormControl('', [Validators.required]),
      couponStartTime: new FormControl('', [Validators.required]),
      couponEndDate: new FormControl('', [Validators.required]),
      couponEndTime: new FormControl('', [Validators.required]),
      discountType: new FormControl(null, [Validators.required]),
      discount: new FormControl('', [Validators.required]),
      maxUseCount: new FormControl('', [
        Validators.required,
        this.maxUseCountValidator(),
      ]),
      campaignUsageIntervalinMins: new FormControl(
        { disabled: true, value: null },
        [Validators.required]
      ),
      minOrderValue: new FormControl('', [Validators.required]),
      maxDiscountUpto: new FormControl({ disabled: true, value: '' }, [
        Validators.required,
      ]),
    },
    { validators: [this.discountValidator(), this.dateTimeValidator()] }
  );

  ngOnInit(): void {
    this.getPayoutSummaryReport();
    this.getCustomerReviewsData();
    this.getAllDiscountOffersData();
    this.getSalesData();

    this.subscriptions.push(
      this.sharedService.resetData$.pipe(skip(1)).subscribe(flag => {
        if (flag) this.reinitializeData();
      })
    )
  }

  /**
   * Method that will invokes when user changes 
   * outlet from home-component and it will recalls 
   * methods to update data for the selected outlet
   */
  reinitializeData() {
    this.getPayoutSummaryReport();
    this.getCustomerReviewsData();
    this.getAllDiscountOffersData();
    this.getSalesData();
  }

  /**
   * Method that send create new campaign
   * @returns
   */
  createDiscount() {
    if (this.addNewDiscountForm.status === 'INVALID') {
      this.addNewDiscountForm.markAllAsTouched();
      return;
    }
    const formValues = this.addNewDiscountForm.getRawValue();
    const data: Coupon = new Coupon();
    Object.assign(data, formValues);
    this.subscriptions.push(
      this.businessService.createCoupon(data.toJson()).subscribe((res) => {
        this.toastMsgService.showSuccess(
          `Campaign: ${res['result']['coupon_details']['code']} Created Successfully!!!`
        );
        this.addNewDiscountForm.reset();
        this.closeAddNewDiscountModal();
        this.getAllDiscountOffersData();
      })
    );
  }

  /**
   * Method that get all discount offers
   */
  getAllDiscountOffersData() {
    this.subscriptions.push(
      this.businessService.getAllCoupons().subscribe((res) => {
        this.discountsData[DiscountTabs.Ongoing] = [];
        this.discountsData[DiscountTabs.Upcoming] = [];
        this.discountsData[DiscountTabs.NewAvailable] = [];
        this.discountsData[DiscountTabs.Expired] = [];

        for (const a of res['result']['active_coupon']) {
          this.discountsData[DiscountTabs.Ongoing].push(Coupon.fromJson(a));
        }
        for (const u of res['result']['upcoming_coupon']) {
          this.discountsData[DiscountTabs.Upcoming].push(Coupon.fromJson(u));
        }
        for (const n of res['result']['avilable_for_optin_coupon']) {
          this.discountsData[DiscountTabs.NewAvailable].push(
            Coupon.fromJson(n)
          );
        }
        for (const e of res['result']['expired_coupon']) {
          this.discountsData[DiscountTabs.Expired].push(Coupon.fromJson(e));
        }
        this.initDiscountSequenceData();
      })
    );
  }



  /**
 * Method that initializes the discount sequence data by mapping the necessary properties from the ongoing discounts data
 * and sorting it by discount sequence.
 */
  initDiscountSequenceData() {
    this.discountSequenceData = this.discountsData[DiscountTabs.Ongoing].map(i => ({
      couponName: i.couponName,
      couponMappingId: i.mappingDetails[0].id,
      discountSequence: i.mappingDetails[0].sequence
    })).sort((a, b) => a.discountSequence - b.discountSequence);
  }


  /**
   * Method that opens the discount sequence dialog box
   * and sends updated sequence of discount to API
   */
  openDiscountSequenceDialog() {
    const dialogRef = this.dialog.open(DiscountSequenceDialogComponent, {
      data: this.discountSequenceData
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response?.flag) {
        const data = {};
        data['coupon_mappings'] = this.discountSequenceData.map(item => ({
          id: item.couponMappingId,
          sequence: item.discountSequence
        }))
        this.businessService.toChangeDiscountSequence(data).subscribe(res => {
          this.toastMsgService.showSuccess('Discount sequence updated successfully')
        })
      }
    })
  }

  /**
   * Method that navigates to view-payouts page
   */
  navigateToViewPayoutsPage() {
    this.router.navigate(['business/view-payouts']);
  }

  /**
   * Method that opens order details modal
   */
   openOrderDetailsModal(orderId: number) {
    this.sharedService.setOrderDetailsModal(true, orderId);
  }

  /**
   * Method that toggle add new discount modal
   */
  openAddNewDiscountModal() {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);
    this.showAddnewDiscountModal = !this.showAddnewDiscountModal;
    this.renderer.addClass(document.body, 'overlay-enabled')
  }

  closeAddNewDiscountModal() {
    if (this.addNewDiscountForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Unsaved data will be lost. Do you still want to continue?',
          confirmBtnText: 'OK',
          dismissBtnText: 'Cancel'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.addNewDiscountForm.reset();
          this.showAddnewDiscountModal = false;
          this.renderer.removeClass(document.body, 'overlay-enabled');
        }
      });
      return;
    }
    this.showAddnewDiscountModal = false;
    this.renderer.removeClass(document.body, 'overlay-enabled');
  }

  /**
   * Method that toggles b/w tabs of discount section
   * @param tabName
   */
  toggleDiscountTabs(tabName: DiscountTabs) {
    // this.showOngoingDiscountOffersTab = flag;
    this.currentDiscountTab = tabName;
    this.currentDiscountsPage = 1;
  }

  /**
   * Method that opens view-payouts dialog
   */
  openPOCDetailsDialog() {
    const dialogRef = this.dialog.open(ViewPointOfContactDialogComponent, {
      autoFocus: false,
    });
  }

  /**
   * Method that opt-out all coupons
   * it binds mapping ids of all coupons into an array
   * and calls optOut method
   * @param coupons 
   */
  optOutFromAllDiscounts(coupons: Coupon[]) {
    const mappingIds = [];
    coupons.forEach(coupon => {
      coupon.mappingDetails.forEach(mapping => {
        mappingIds.push(mapping.id);
      })
    })
    const confirmationMsg = 'Do you want to opt out from all discounts?';
    this.optout(mappingIds, confirmationMsg);
  }

  /**
   * Method that opt-out from all mappings of particular coupon
   * it binds mapping ids of particular coupon in an array and 
   * calls optOut method
   * @param couponMapping 
   */
  optoutFromAllMappings(couponMapping: CouponMapping[]) {
    const mappingIds = couponMapping.map(mapping => mapping.id);
    const confirmationMsg = 'Do you want to opt out from all durations?';
    this.optout(mappingIds, confirmationMsg);
  }

  /**
   * Method that opens view discount details dialog
   * @param coupon
   */
  openDiscountDetailsDialog(coupon: Coupon) {
    const dialogRef = this.dialog.open(ViewDiscountDialogComponent, {
      data: {
        coupon,
        currentDiscountTab: this.currentDiscountTab,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response?.flag) {
        const mappingIds = [response.mappingId];
        const confirmationMsg = 'Do you want to opt out from selected duration?';
        this.optout(mappingIds, confirmationMsg);
      }
    });
  }

  /**
   * Method that optin coupons
   * @param coupon
   */
  optin(coupon: Coupon) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);
    const dialogRef = this.dialog.open(OptInDialogComponent, {data: coupon});
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          coupon_id: coupon.couponId,
        };
        if (response.duration) {
          data['mapping_duration'] = {};
          data['mapping_duration']['start_time'] =
            response.duration.epochStartTime;
          data['mapping_duration']['end_time'] =
            response.duration.epochEndTime;
        }
        this.subscriptions.push(
          this.businessService.postRestaurantOptin(data).subscribe((res) => {
            this.getAllDiscountOffersData();
            this.toastMsgService.showSuccess('Opt-In Successfully');
          })
        );
      }
    });
  }

  /**
   * Method that optout from mappings Ids that is passed
   * @param mappingIds
   * @param confirmationMsg
   */
  optout(mappingIds: number[], confirmationMsg: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'remove',
        dismissBtnText: 'not now',
        message: confirmationMsg,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        const data = {
          coupon_mapping_ids: mappingIds,
        };
        this.subscriptions.push(
          this.businessService.postRestaurantOptout(data).subscribe((res) => {
            this.getAllDiscountOffersData();
            this.toastMsgService.showSuccess('Opt-Out Successfully');
          })
        );
      }
    });
  }

  /**
   * Method that enable-disable fields based on discount-type selection
   */
  onDiscountTypeSelection() {
    if (this.addNewDiscountForm.get('discountType').value === 'upto') {
      this.isUptoDiscountType = true;
      this.addNewDiscountForm.get('maxDiscountUpto').enable();
    } else {
      this.isUptoDiscountType = false;
      this.addNewDiscountForm.get('maxDiscountUpto').disable();
    }
  }

  /**
   * Method that validates maxUseCount field and
   * enable-disable campaignUsageIntervalinMins field based on the maxUseCount
   * @returns
   */
  maxUseCountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const val = control.value;
      if (this.addNewDiscountForm) {
        if (val < 1 || val > 20) {
          this.showCampaignUsageIntervalField = false;
          this.addNewDiscountForm['controls'][
            'campaignUsageIntervalinMins'
          ].disable();
          return { maxUseCount: true };
        }
        if (val == 1) {
          this.showCampaignUsageIntervalField = false;
          this.addNewDiscountForm['controls'][
            'campaignUsageIntervalinMins'
          ].disable();
        }
        if (val > 1) {
          this.showCampaignUsageIntervalField = true;
          this.addNewDiscountForm['controls'][
            'campaignUsageIntervalinMins'
          ].enable();
        }
      }
    };
  }

  /**
   * Method that validates discount field
   * @returns
   */
  discountValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (this.addNewDiscountForm) {
        if (
          group.get('discountType').value === 'upto' &&
          group['controls']['discount'].value > 100
        ) {
          group['controls']['discount'].setErrors({ max: { max: 100 } });
        } else {
          group['controls']['discount'].setErrors(null);
        }
      }
      return;
    };
  }

  /**
   * Method that validates start,end date and time
   * @returns
   */
  dateTimeValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (this.addNewDiscountForm) {
        let startDate = group['controls']['couponStartDate']['value'];
        let startTime = group['controls']['couponStartTime']['value'];
        let endDate = group['controls']['couponEndDate']['value'];
        let endTime = group['controls']['couponEndTime']['value'];
        startDate = moment(startDate).format('YYYY-MM-DD');
        startTime = moment(startTime, 'h:mm A').format('HH:mm:ss');
        const startDateTime = new Date(startDate + ' ' + startTime);

        endDate = moment(endDate).format('YYYY-MM-DD');
        endTime = moment(endTime, 'h:mm A').format('HH:mm:ss');
        const endDateTime = new Date(endDate + ' ' + endTime);

        if (this.currentDate > startDateTime) {
          group['controls']['couponStartTime'].setErrors({
            startTimeMore: true,
          });
        } else if (startDateTime > endDateTime) {
          group['controls']['couponEndTime'].setErrors({ endTimeMore: true });
        } else {
          group['controls']['couponStartTime'].setErrors(null);
          group['controls']['couponEndTime'].setErrors(null);
        }
        return;
      }
    };
  }

  /* -------------- Payout ------------*/
  /**
   * Method that get payout summary report
   */

  getPayoutSummaryReport() {
    const data = {
      duration: 'today',
    };
    this.subscriptions.push(
      this.businessService.getPayoutSummary(data).subscribe((res) => {
        this.payoutSummary['isPayoutOnHold'] = res['result']['hold_payout'];
        this.payoutSummary['lastPayoutAmount'] =
          res['result']['last_payout']?.['amount'];
        this.payoutSummary['lastPayoutDate'] =
          res['result']['last_payout']?.['payout_date'];
        this.payoutSummary['lastPayoutStartDate'] =
          res['result']['last_payout']?.['start_date'];
        this.payoutSummary['lastPayoutEndDate'] =
          res['result']['last_payout']?.['end_date'];
        this.payoutSummary['lastPayoutStatus'] =
          PayoutStatus[res['result']['last_payout']?.['status']];

        this.payoutSummary['upcomingPayoutAmount'] =
          res['result']['upcomming_payout']?.['amount'];
        this.payoutSummary['upcomingPayoutDate'] =
          res['result']['upcomming_payout']?.['payout_date'];
        this.payoutSummary['upcomingPayoutStartDate'] =
          res['result']['upcomming_payout']?.['start_date'];
        this.payoutSummary['upcomingPayoutEndDate'] =
          res['result']['upcomming_payout']?.['end_date'];

        this.payoutSummary['totalAmountPaid'] =
          res['result']['history']['amount'];
        this.payoutSummary['pocContactNumber'] =
          res['result']['poc_number'];
      })
    );
  }

  /* -------------- Customer Reviews ------------*/

  /**
   * Method that gets customer reviews
   */
  getCustomerReviewsData() {
    const data = {
      pagination: {
        page_index: this.currentCustomerReviewsPage - 1,
        page_size: 4,
      },
      sort: [
        {
          column: 'created_at',
          order: 'desc',
        },
      ],
    };
    this.subscriptions.push(
      this.businessService.getCustomerReviews(data).subscribe((res) => {
        this.totalCustomerReviewsCount = res['result']['total_records'];
        this.totalCustomerLikeCount = res['result']['like_count_label'];
        this.totalCustomerDislikeCount = res['result']['dislike_count_label'];
        this.customerReviewsList = [];
        for (const i of res['result']['records']) {
          this.customerReviewsList.push(CustomerReview.fromJson(i));
        }
      })
    );
  }

  /**
   * Method that returns array of length of passed parameter
   * @param i
   * @returns
   */
  counter(i: number) {
    return new Array(i);
  }

  /* ----------- Sales Report ----------------- */

  /**
   * Method that gets sales data
   */
  getSalesData() {
    const data = {
      duration: this.salesReportDurationType,
    };
    if (this.salesReportDurationType === 'custom_range' && (this.filterSalesReportByStartTime && !this.filterSalesReportByEndTime))
      return this.toastMsgService.showError('Kindly enter end date');
      if (this.salesReportDurationType === 'custom_range' && (!this.filterSalesReportByStartTime && this.filterSalesReportByEndTime))
      return this.toastMsgService.showError('Kindly enter Start date');
      const startDate = moment(this.filterSalesReportByStartTime).format('YYYY-MM-DD');
      const startTime = moment(this.startTime, 'h:mm A').format('HH:mm:ss');
      const endDate = moment(this.filterSalesReportByEndTime).format('YYYY-MM-DD');
      const endTime = moment(this.endTime,'h:mm A').format('HH:mm:ss');
      const startDateTime = new Date(startDate + ' ' + startTime);
      const endDateTime = new Date(endDate + ' ' + endTime);
    if (this.filterSalesReportByStartTime && this.filterSalesReportByEndTime) {
      const endDate = new Date (moment(this.filterSalesReportByEndTime).format('YYYY-MM-DD') + ' ' + '23:59:59');
      data['start_epoch'] = this.startTime? moment(startDateTime).unix() : moment(startDate).unix();
      data['end_epoch'] = this.endTime? moment(endDateTime).unix() : moment(endDate).unix();
      this.isCustomDateRangeSelected = true;
    }
    this.businessService.getSalesReport(data).subscribe((res) => {
      this.totalSalesAmount = res['result']['total_vendor_sales_amount'];
      this.salesReportStartTime = moment
        .unix(res['result']['start_time'])
        .format('DD MMM YYYY');
      this.salesReportEndTime = moment
        .unix(res['result']['end_time'])
        .format('DD MMM y');
      this.salesReportList = [];
      for (const i of res['result']['duration_wise_order_sales']) {
        this.salesReportList.push(
          Sales.fromJson(this.salesReportDurationType, i)
        );
      }
      this.calculateSalesBarHeight();
    });
  }

  /**
   * Method that calculates bar height of each data marking max vendor amount as 100%
   */
  calculateSalesBarHeight() {
    const maxValue = Math.max(
      ...this.salesReportList.map((sale) =>
        sale.totalVendorSalesAmount ? sale.totalVendorSalesAmount : 0
      )
    );
    for (const i of this.salesReportList) {
      if (i['totalVendorSalesAmount'])
        i['barHeight'] = (i['totalVendorSalesAmount'] / maxValue) * 100;
    }
  }

  /**
   * Method that invokes on change of duration type
   * @param durationType
   */
  salesReportDurationChange(durationType: Duration) {
      this.salesReportDurationType = durationType;
      this.filterSalesReportByStartTime = null;
      this.filterSalesReportByEndTime = null;
      if (durationType === 'custom_range') {
        this.showCustomDateFilterFields = true;
        this.totalSalesAmount =
          this.salesReportStartTime =
          this.salesReportEndTime =
          this.startTime =
          this.endTime =
          null;
        this.salesReportList = [];
        // this.toastMsgService.showInfo('Kindly select date range');
        this.isCustomDateRangeSelected = false;
      } else {
        this.showCustomDateFilterFields = false;
        this.getSalesData();
      }
  }

  /**
   * Method that invokes in mousedown event and sets
   * starting values of mouseDrag variable
   * @param event
   * @param sliderFor
   */
  onMouseDown(event: MouseEvent, sliderFor: 'sales' | 'discounts') {
    let element: ElementRef;
    sliderFor === 'sales'
      ? (element = this.salesDurationSlider)
      : (element = this.discountTabSlider);

    this.mouseDrag.isDown = true;
    this.mouseDrag.startX = event.pageX - element.nativeElement.offsetLeft;
    this.mouseDrag.scrollLeft = element.nativeElement.scrollLeft;
  }

  /**
   * Method that invokes on mouseup and mouseleave event
   */
  stopDragging() {
    this.mouseDrag.isDown = false;
  }

  /**
   * Method that invokes on mouse move event and
   * scrolls the element accordingly
   * @param event
   * @param sliderFor
   * @returns
   */
  onMouseMove(event: MouseEvent, sliderFor: 'sales' | 'discounts') {
    let element: ElementRef;
    sliderFor === 'sales'
      ? (element = this.salesDurationSlider)
      : (element = this.discountTabSlider);

    if (!this.mouseDrag.isDown) return;
    event.preventDefault();
    const x = event.pageX - element.nativeElement.offsetLeft;
    const walk = x - this.mouseDrag.startX;
    element.nativeElement.scrollLeft = this.mouseDrag.scrollLeft - walk;
  }

  /**
   * Method that converts input into uppercase
   * @param event
   */
  convertToUppercase(event: Event) {
    const target = event.target as HTMLInputElement;
    const start = target.selectionStart;
    target.value = target.value.toUpperCase();
    target.setSelectionRange(start, start);
  }

   /**
   * Method that reset filter form fields values and make API call for orders Data
   */
   resetFilterControls(field: string) {
    if (field === 'date') {
      this.salesReportDurationChange('custom_range');
    } else if(field === 'startTime') {
      this.startTime = null;
      this.getSalesData();
    } else if(field === 'endTime') {
      this.endTime = null;
      this.getSalesData();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
