import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  maximumItemQuantity: number = 1;
  maxDefaultItemQuantity: number;
  showEditQuantityDialog: boolean;
  showOutOfStockDialog: boolean;
  maxQuantityOfItem: number;

  constructor(
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastMsgService: ToastService
  ) {
    this.showOutOfStockDialog = data.showOutOfStockDialog;
    this.showEditQuantityDialog = data.showEditQuantityDialog;
    this.maxQuantityOfItem = data.maxQuantity;
  }

  ngOnInit(): void { }

  /**
   * Handles the confirmation action for the maximum item quantity.
   * Closes the dialog and passes the maximum item quantity if available, otherwise, closes without data.
   */
  onConfirm() {
    this.maxDefaultItemQuantity !== null ? this.dialogRef.close({ flag: true, maximumItemQuantity: this.maximumItemQuantity }) : this.dialogRef.close({ flag: true });
  }

  /**
   * Handles the dismissal action.
   * Closes the dialog without passing any data.
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }

  /**
   * Edits the maximum item quantity based on the specified action type ('increase' or 'decrease').
   * @param actionType 
   */
  editMaximumItem(actionType: string) {
    if (actionType === 'increase' && this.maximumItemQuantity < this.maxQuantityOfItem ) {
      this.maximumItemQuantity += 1;
    }
    if (actionType === 'decrease' && this.maximumItemQuantity > 1) {
      this.maximumItemQuantity -= 1;
    }
  }
}
