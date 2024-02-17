import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SubscriptionAction } from '../model/subscription';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss'],
})
export class SubscriptionDialogComponent implements OnInit {
  action: SubscriptionAction;
  cancellationReason = new FormControl('', [Validators.required]);
  retryPaymentForm = new FormGroup({
    date: new FormControl('', []),
    time: new FormControl('', []),
  });
  readonly subscriptionAction = SubscriptionAction;
  currentDate: Date = new Date();
  constructor(
    public dialogRef: MatDialogRef<SubscriptionDialogComponent>,
    private toastMsgService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
  }

  ngOnInit(): void {}

  /**
   * Method that emits cancellation reason after validation
   */
  onConfirm() {
    if (this.action === SubscriptionAction.Cancel) {
      if (this.cancellationReason.status === 'INVALID')
        return this.cancellationReason.markAsTouched();
      const cancellationReason = this.cancellationReason.value;
      this.dialogRef.close({ flag: true, cancellationReason });
    } else if (this.action === SubscriptionAction.RetryPayment) {
      let date = this.retryPaymentForm['controls']['date']['value'];
      let time = this.retryPaymentForm['controls']['time']['value'];
      let nextPaymentDate: number;
      if ((date && !time) || (!date && time))
        return this.toastMsgService.showWarning(
          'Kindly enter both date and time'
        );
      if (date && time) {
        date = moment(date).format('YYYY-MM-DD');
        time = moment(time, 'h:mm A').format('HH:mm:ss');
        nextPaymentDate = moment(new Date(`${date} ${time}`)).unix();
      }
      this.dialogRef.close({ flag: true, nextPaymentDate });
    }
  }
  /**
   * Method that closed the dialog box
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
