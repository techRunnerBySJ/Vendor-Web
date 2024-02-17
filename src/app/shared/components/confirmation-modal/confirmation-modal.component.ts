import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Input() customContent: string;
  @Input() customSubmitText: string;

  constructor() { }

  ngOnInit() {
  }


  hideModal() {
    this.close.emit(false);
  }


  closeModal(close) {
    if (close) {
      this.close.emit(true);
    } else {
      this.close.emit(false);
    }
  }

}
