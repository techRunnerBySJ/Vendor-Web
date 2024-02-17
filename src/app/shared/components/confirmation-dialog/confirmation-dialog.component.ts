import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  confirmBtnText: string;
  dismissBtnText: string;
  message: string;
  alert: string;
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.confirmBtnText = data.confirmBtnText
      this.dismissBtnText = data.dismissBtnText
      this.message = data.message
      this.alert = data.alert
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
  }
  
  /**
   * Method that gets invokes on 'yes' button click
   */
  onConfirm() {
    this.dialogRef.close(true);
  }
  /**
   * Method that gets invokes on 'no' button click
   */
  onDismiss() {
    this.dialogRef.close(false);
  }

}
