import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-point-of-contact-dialog',
  templateUrl: './view-point-of-contact-dialog.component.html',
  styleUrls: ['./view-point-of-contact-dialog.component.scss']
})
export class ViewPointOfContactDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewPointOfContactDialogComponent>) { }

  ngOnInit(): void {
  }

}
