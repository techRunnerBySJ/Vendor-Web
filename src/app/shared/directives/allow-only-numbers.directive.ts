import { Directive, HostListener} from '@angular/core';

@Directive({
    selector: '[appAllowOnlyNumbers]'
})

export class AllowOnlyNumbers {
    constructor() {
    }
    @HostListener('keypress', ['$event']) public disableKeys(e: any) {
      return e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57)
    }
}
