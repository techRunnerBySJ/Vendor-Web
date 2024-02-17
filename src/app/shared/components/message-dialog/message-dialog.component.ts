import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  type: string;
  message: string;
  showStatus:boolean = false;
  buttonText: string;
  
  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.type = data.type;
      this.message = data.message;
      this.buttonText = data.buttonText;
      this.showStatus = data.showStatus;
     }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

  /**
   * Method that close dialog 
   */
  onDismiss() {
    this.dialogRef.close(false);
  }
}
