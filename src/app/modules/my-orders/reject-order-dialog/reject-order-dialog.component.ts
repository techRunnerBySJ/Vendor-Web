import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyOrdersService } from 'src/app/shared/services/my-orders.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CancellationPolicy, CancellationReason, OrderAction } from '../model/order';

@Component({
  selector: 'app-reject-order-dialog',
  templateUrl: './reject-order-dialog.component.html',
  styleUrls: ['./reject-order-dialog.component.scss']
})
export class RejectOrderDialogComponent implements OnInit {

  showDescribeReasonField: boolean;
  orderAction: OrderAction;
  declineOrderForm = new FormGroup({
    reason: new FormControl('', [Validators.required]),
    describeReason: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.minLength(10)])
  })
  cancellationReasonsList: CancellationReason[];
  cancellationPolicy: CancellationPolicy;

  constructor(public dialogRef: MatDialogRef<RejectOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastMsgService: ToastService, private myOrdersService: MyOrdersService) {
    this.orderAction = data.action;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.cancellationReasonsList = this.myOrdersService.cancellationReasons;
    this.cancellationPolicy = this.myOrdersService.cancellationPolicy;
  }

  /**
   * Method that enable/disable 'describeReason' field based on 
   * radio button selection
   */
  radioBtnSelectionChange() {
    if (this.declineOrderForm.get('reason').value === 'others') {
      this.declineOrderForm['controls']['describeReason'].setValue('');
      this.declineOrderForm['controls']['describeReason'].enable();
      this.showDescribeReasonField = true;
    } else {
      this.declineOrderForm['controls']['describeReason'].setValue(this.declineOrderForm.get('reason').value);
      this.declineOrderForm['controls']['describeReason'].disable();
      this.showDescribeReasonField = false;
    }
  }

  /**
   * Method that checks validity of 'declineOrderForm'
   * and emits reason and close the dialog
   */
  onConfirm() {
    if (this.declineOrderForm.get('reason').status === 'INVALID') {
      this.toastMsgService.showInfo('Kindly select reason of cancellation to continue');
      return;
    }
    if (this.declineOrderForm.get('describeReason').status === 'INVALID') {
      this.declineOrderForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close({ flag: true, reason: this.declineOrderForm.get('describeReason').value })
  }

  /**
 * Method that close the dialog
 */
  onDismiss() {
    this.dialogRef.close({ flag: false })
  }
}
