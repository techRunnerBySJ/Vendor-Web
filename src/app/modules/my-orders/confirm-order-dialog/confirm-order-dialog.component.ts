import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderAction } from '../model/order';
import { HomeService } from 'src/app/shared/services/home.service';

@Component({
  selector: 'app-confirm-order-dialog',
  templateUrl: './confirm-order-dialog.component.html',
  styleUrls: ['./confirm-order-dialog.component.scss']
})
export class ConfirmOrderDialogComponent implements OnInit {

  orderAction: OrderAction;
  preparationTime: number = 5;
  maxDefaultPrepTime: number;
  hasSponsoredRider: boolean;
  useSponsoredRider: boolean = false;
  sponsoredRiderName: any[] = [];
  constructor(public dialogRef: MatDialogRef<ConfirmOrderDialogComponent>,private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.orderAction = data.action
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.homeService.outletDetails$.subscribe(data => {
      this.maxDefaultPrepTime = data.get('primaryOutlet').defaultPrepTime;
      this.hasSponsoredRider = data.get('primaryOutlet').hasSponsoredRider;
    });
    if (this.data.defaultPrepTime) {
      this.preparationTime = this.data.defaultPrepTime
    }
  }

  /**
   * Method that increase/decrease preparationTime
   * @param actionType 
   */
  editPreparationTime(actionType: string) {
    if (actionType === 'increase' && this.preparationTime < this.maxDefaultPrepTime + 10 && this.preparationTime < 119) {
      this.preparationTime += 2;
    }
    if (actionType === 'decrease' && this.preparationTime > 5) {
      this.preparationTime -= 2;
    }
  }

  /**
   * Method that emits preparation time and close the dialog
   */
  onConfirm() {
    if(this.useSponsoredRider) {
      this.dialogRef.close({ flag: true, preparationTime: this.preparationTime, useSponsoredRider: this.useSponsoredRider })
    }else{
      this.dialogRef.close({ flag: true, preparationTime: this.preparationTime })
    }
  }

  /**
   * Method that close the dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false })
  }
}
