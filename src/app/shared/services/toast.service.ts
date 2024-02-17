import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToast = new BehaviorSubject(false);
  message = '';
  type = '';
  constructor(private toastrService: ToastrService) {}

  displayToast(type: string, message: string) {
    this.message = message;
    this.type = type;
    this.showToast.next(true);
    setTimeout(() => {
      this.showToast.next(false);
    }, 4500);
  }
  public showSuccess(message): void {
    this.toastrService.success(message);
  }

  public showInfo(
    message,
    title?: string,
    override?: Partial<IndividualConfig>
  ): void {
    this.toastrService.info(message, title, override);
  }

  public showWarning(message): void {
    this.toastrService.warning(message);
  }

  public showError(message): void {
    this.toastrService.error(message);
  }
}
