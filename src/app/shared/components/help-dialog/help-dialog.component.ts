import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent implements OnInit {

  @Output() closeModal = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closeModal.emit();
  }
}
