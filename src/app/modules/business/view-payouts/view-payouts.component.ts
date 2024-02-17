import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { BusinessService } from 'src/app/shared/services/business.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { months, Payout, PayoutAccount, PayoutStatus, years } from '../model/payout';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-payouts',
  templateUrl: './view-payouts.component.html',
  styleUrls: ['./view-payouts.component.scss'],
})
export class ViewPayoutsComponent implements OnInit, OnDestroy {
  showAddNewAccountModal: boolean;
  bankAccountsList: PayoutAccount[] = [];
  payoutsList: Payout[] = [];
  currentPayoutDetails: Payout;
  totalPayouts: number;
  currentPage: number = 1;
  maxDate = new Date();
  orangeStatusArray = [PayoutStatus.INIT, PayoutStatus.PENDING];
  greenStatusArray = [PayoutStatus.COMPLETE];
  redStatusArray = [
    PayoutStatus.FAILED,
    PayoutStatus.REJECTED,
    PayoutStatus.REVERSED,
  ];
  showWarningMsg: boolean;
  readonly payoutStatus = PayoutStatus;
  fromDate: Date;
  toDate: Date;
  statuses: string[];
  greaterThanAmount: number;
  lessThanAmount: number;
  pageIndex: number = 0;
  subscriptions: Subscription[] = [];
  readonly months = months;
  readonly years = years;
  selectedMonth: number;
  selectedYear: number;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private businessService: BusinessService,
    private toastMsgService: ToastService,
    private sharedService: SharedService
  ) { }

  bankAccountForm = new FormGroup({
    beneficiaryName: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{9,18}'),
    ]),
    ifscCode: new FormControl('', [
      Validators.required,
      Validators.pattern('[A-Z]{4}[A-Z0-9]{7}'),
    ]),
  });
  ngOnInit(): void {
    this.getBankAccountsDetails();
    this.getPayoutsData();

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
    this.getBankAccountsDetails();
    this.getPayoutsData();
  }

  /**
   * Method that navigates to business page
   */
  navigateToBusinessPage() {
    this.router.navigate(['business']);
  }

  /**
   * Method that toggles add new account modal
   */
  toggleAddNewAccountModal() {
    this.showAddNewAccountModal = !this.showAddNewAccountModal;
  }

  /**
   * Method that fetch all bank details data
   */
  getBankAccountsDetails() {
    this.businessService.getPayoutAccounts().subscribe((res) => {
      this.bankAccountsList = [];
      let count = 0;
      for (const i of res['result']) {
        if (i['is_primary']) {
          count++;
        }
        this.bankAccountsList.push(PayoutAccount.fromJson(i));
      }
      count > 0 ? (this.showWarningMsg = false) : (this.showWarningMsg = true);
    });
  }

  /**
   * Method that adds bank account
   */
  addBankAccount() {
    const data = {
      name: this.bankAccountForm.get('beneficiaryName').value,
      bank_account_number: this.bankAccountForm.get('accountNumber').value,
      ifsc_code: this.bankAccountForm.get('ifscCode').value,
    };
    this.businessService.postPayoutAccount(data).subscribe((res) => {
      this.bankAccountForm.reset();
      this.toggleAddNewAccountModal();
      this.toastMsgService.showSuccess('Bank details added successfully');
      this.getBankAccountsDetails();
    });
  }

  /**
   * Method that display only last 4 digits of bank account
   * @param accountNumber
   * @returns
   */
  displayAccountNumber(accountNumber: string) {
    return (
      new Array(accountNumber.length - 4 + 1).join('x') +
      accountNumber.slice(-4)
    ); // here 4 is last n digits to show
  }

  /**
   * Method that verifies IFSC Code of bank account
   * @param bankAccount
   */
  verifyIfscCode(bankAccount: PayoutAccount) {
    this.businessService
      .verifyPayoutAccountIfscCode(
        bankAccount.payoutAccountId,
        bankAccount.ifscCode
      )
      .subscribe((res) => {
        bankAccount['isIfscVerified'] = res['result']['ifsc_verified'];
        this.toastMsgService.showSuccess('IFSC Code is verified!!!');
      });
  }

  /**
   * Method that makes account as primary
   * @param bankAccount
   */
  makePrimaryBankAccount(bankAccount: PayoutAccount) {
    this.businessService
      .makePrimaryPayoutAccount(bankAccount.payoutAccountId)
      .subscribe((res) => {
        this.bankAccountsList.forEach((acc) => {
          acc['isPrimary'] = false;
        });
        bankAccount['isPrimary'] = res['result']['is_primary'];
        this.toastMsgService.showSuccess('Primary bank account updated!!!');
        this.showWarningMsg = false;
      });
  }

  /**
   * Method that deletes account
   * @param bankAccount
   */
  removeAccount(bankAccount: PayoutAccount) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'remove',
        dismissBtnText: 'not now',
        message: bankAccount.isPrimary 
          ? 'Primary account cannot be removed. Please change primary first.' 
          : 'Are you sure you want to remove this account?',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response && !bankAccount.isPrimary) {
        this.businessService
          .deletePayoutAccountDetailsById(bankAccount.payoutAccountId)
          .subscribe((res) => {
            this.getBankAccountsDetails();
            this.toastMsgService.showSuccess('Account removed successfully');
          });
      }
    });
  }
  
  

  /**
   * Method that exports payout report in pdf
   * @param payouts
   */
  public generatePdf(payouts?: Payout[]) {
    let fileName: string;
    if (!payouts) {
      payouts = [this.currentPayoutDetails];
      fileName = this.currentPayoutDetails.payoutId;
    } else {
      fileName = `${months.find(item => item.id === this.selectedMonth).name}_${this.selectedYear}_Payouts`
    }
    const layout = {
      fillColor: (i, node) => {
        return i % 2 === 0 ? '#fafafe' : null;
      },
      hLineColor: (i, node) => {
        return i === 0 || i === node.table.body.length ? 'black' : 'gray';
      },
      vLineColor: (i, node) => {
        return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
      },
    };
    const data = [];
    for (const payout of payouts) {
      data.push(

        {
          text: [{ text: 'Payout ID: ', style: 'subHeader' }, payout.payoutId],
        },
        {
          text: [{ text: 'Txn ID: ', style: 'subHeader' }, payout.txnIdByAdmin],
        },
        {
          text: [
            { text: 'Outlet Name: ', style: 'subHeader' },
            payout.outletName,
          ],
        },
        {
          text: [
            { text: 'Duration: ', style: 'subHeader' },
            `${moment(payout.startDate).format('D MMM')} - ${moment(
              payout.endDate
            ).format('D MMM')}`,
          ],
        },
        {
          text: [{ text: 'Status: ', style: 'subHeader' }, payout.payoutStatus],
        },
        {
          text: [
            { text: 'Processed On: ', style: 'subHeader' },
            payout.payoutCompletedTime
              ? moment(payout.payoutCompletedTime).format('D MMM, YYYY')
              : 'N/A',
          ],
        },
        {
          margin: [0, 10, 0, 10],
          layout,
          table: {
            headerRows: 1,
            body: this.pdfBody(payout),
          },
        },
        {
          margin: [0, 10, 0, 10],
          layout,
          table: {
            widths: ['50%', '50%'],
            body: [
              ['Total Order Amount (₹)', payout.totalOrderAmount],
              ['Transaction Changes (₹)', payout.txnCharges],
              ['Amount Paid (₹)', payout.amountPaidToVendor],
            ],
          },
        },
      )
    }
    const pdfData = {
      content: [
        { text: `Payout Report`, style: 'header' },
        {
          absolutePosition: { x: 480, y: 20 }, // Adjust the values of x and y as needed
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
          image:
            'data:image/png;base64,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',
        },
        data
      ],
      styles: {
        header: {
          fontSize: 18,
          alignment: 'center',
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        }
      },
    };
    pdfmake.createPdf(pdfData).download(`${fileName}.pdf`);
  }

  /**
   * Method that returns body of table for pdf export
   * @param payout
   * @returns
   */
  pdfBody(payout: Payout) {
    let body = [];
    body.push([
      { text: 'Order ID', style: 'tableHeader' },
      { text: 'Payout Amount (₹)', style: 'tableHeader' },
      { text: 'Actual Payout Amount (₹)', style: 'tableHeader' },
      { text: 'Remarks (if any)', style: 'tableHeader' },
    ]);
    for (const i of payout.payoutOrders) {
      let actualVendorPayoutAmount, remarksForVendor;
      if (i['orderStatus'] === 'cancelled') {
        actualVendorPayoutAmount = i['refundDetails']['vendorPayoutAmount'];
        remarksForVendor = i['refundDetails']['remarksForVendor'];
      } else {
        actualVendorPayoutAmount = i['invoiceDetails']['vendorPayoutAmount'];
        remarksForVendor = '';
      }

      body.push([
        i['orderId'],
        i['invoiceDetails']['vendorPayoutAmount'],
        actualVendorPayoutAmount,
        remarksForVendor,
      ]);
    }
    return body;
  }

  /**
   * Method that get payout details
   * @param filterFlag
   */
  getPayoutsData(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
    }
    const data = {};
    data['pagination'] = {
      page_index: this.currentPage - 1,
      page_size: 4,
    };
    (data['sort_by'] = {
      column: 'created_at',
      direction: 'desc',
    }),
      (data['filter'] = {});
    if (this.statuses) {
      data['filter']['status'] = this.statuses;
    }
    if (this.fromDate || this.toDate) {
      data['filter']['start_date'] = moment(this.fromDate).format('YYYY-MM-DD');
      data['filter']['end_date'] =
        moment(this.toDate).format('YYYY-MM-DD') + ' 23:59:59';
    }
    if (this.greaterThanAmount) {
      data['filter']['amount_gt'] = this.greaterThanAmount;
    }
    if (this.lessThanAmount) {
      data['filter']['amount_lt'] = this.lessThanAmount;
    }
    this.businessService.getPayoutsData(data).subscribe((res) => {
      this.totalPayouts = res['result']['total_records'];
      this.payoutsList = [];
      for (const i of res['result']['payouts']) {
        this.payoutsList.push(Payout.fromJson(i));
      }
    });
  }

  /**
   * Method that gets payouts for selected month and downloads it in a pdf
   * @returns 
   */
  getMonthwisePayouts() {
    if (!this.selectedMonth || !this.selectedYear) return this.toastMsgService.showInfo('Please select both the month and the year')
    const data = {filter: {}};
    data['pagination'] = {
      page_index: 0,
      page_size: 50,
    };
    data['filter']['payout_completed_duration'] = {
      start_date: moment(new Date(this.selectedYear, this.selectedMonth - 1, 1)).unix(),
      end_date: moment(new Date(this.selectedYear, this.selectedMonth, 0)).unix(),
    }

    this.businessService.getPayoutsData(data).subscribe((res) => {
      const payouts:Payout[] = [];
      for (const i of res['result']['payouts']) {
        payouts.push(Payout.fromJson(i));
      }
      if (!payouts.length) return this.toastMsgService.showInfo('No Payouts found for selected month') 
      this.generatePdf(payouts)
    });
  }
  
  /**
   * Method that clears filter
   */
  clearFilter(field: string) {
    if (field === 'fromDate' || field === 'toDate') {
      this.fromDate = this.toDate = null;
    }
    this.statuses = null;
    this.greaterThanAmount = null;
    this.lessThanAmount = null;
    this.getPayoutsData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
