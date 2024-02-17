import { IDiscountSequence } from './../model/coupon';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-discount-sequence-dialog',
  templateUrl: './discount-sequence-dialog.component.html',
  styleUrls: ['./discount-sequence-dialog.component.scss']
})
export class DiscountSequenceDialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<DiscountSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public discountSequence: IDiscountSequence[]) { }

  ngOnInit(): void {

  }

  /**
   * Method that moves items of the array from one index to another
   * @param event 
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.discountSequence, event.previousIndex, event.currentIndex);
  }

  /**
   * Method that closes the dialog box
   */
  onDismiss() {
    this.dialogRef.close({flag: false});
  }

  /**
   * method that emits the data and closes the dialog box
   */
  onConfirm() {
    this.discountSequence.forEach((item, i) => {
      item.discountSequence = i+1;
    })
    this.dialogRef.close({flag: true, discountSequence: this.discountSequence});
  }

}
