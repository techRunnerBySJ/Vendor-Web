import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coupon, DiscountTabs } from '../model/coupon';

@Component({
  selector: 'app-view-discount-dialog',
  templateUrl: './view-discount-dialog.component.html',
  styleUrls: ['./view-discount-dialog.component.scss']
})
export class ViewDiscountDialogComponent implements OnInit {

  couponDetails: Coupon;
  currentDiscountTab: DiscountTabs;
  readonly discountTabs = DiscountTabs;

  constructor(public dialogRef: MatDialogRef<ViewDiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.couponDetails = this.data.coupon;
    this.currentDiscountTab = this.data.currentDiscountTab;
  }

  /**
   * Methos that close the dialog and emits mappingId
   * to opt-out from discount
   * @param mappingId 
   */
  onConfirm(mappingId: number) {
    this.dialogRef.close({flag: true, mappingId})
  }

  /**
   * Method that close the dialog
   */
  onDismiss() {
    this.dialogRef.close({flag: false})
  }
}
