import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeService } from 'src/app/shared/services/home.service';
import { SponsoredRiders } from '../model/sponsored-order';
import { MyOrdersService } from 'src/app/shared/services/my-orders.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-sponsored-rider-dialog',
  templateUrl: './sponsored-rider-dialog.component.html',
  styleUrls: ['./sponsored-rider-dialog.component.scss']
})
export class SponsoredRiderDialogComponent implements OnInit {

  sponsoredRiders: any[] = [];
  riderId: string;
  constructor(public dialogRef: MatDialogRef<SponsoredRiderDialogComponent>,private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public data: any, private myOrderService: MyOrdersService, private toastMsgService: ToastService) {
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.myOrderService.getSponsoredAvailableRiders(this.data.orderId).subscribe(res => {
      this.sponsoredRiders = [];
      for(const i of res['result']) {
        this.sponsoredRiders.push(SponsoredRiders.fromJson(i));
      }
    })
  }


  /**
   * Method that emits preparation time and close the dialog
   */
  onConfirm() {
    const data ={
      sponsored_rider_id: this.riderId,
    }
    this.myOrderService.postAssignOrderToSponsoredRider(this.data.orderId, data).subscribe(res => {
      this.toastMsgService.showSuccess('Rider Assigned Successfully !!!');
    })
    this.onDismiss();
  }

  /**
   * Method that close the dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false })
  }
}
