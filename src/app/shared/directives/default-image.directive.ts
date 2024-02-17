import { Directive, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked, Input } from '@angular/core';
// import { GraphqlService } from 'src/app/graphql/graphql.service';

@Directive({
  selector: '[appDefaultImage]'
})
export class DefaultImageDirective implements AfterViewInit, AfterViewChecked {

  @Input() type: string;
  @Input() initial = '?';

  ele: HTMLImageElement;

  constructor(
    private elr: ElementRef,
  ) {
    this.ele = this.elr.nativeElement;
   }

   ngAfterViewChecked(): void {
    //  if (this.ele.src && this.ele.src !== this.graphqlService.host + '/null') {
    //   return;
    //  }
    //  this.setDefaultImage();
   }

   ngAfterViewInit(): void {
    // if (this.ele.src && this.ele.src !== this.graphqlService.host + '/null') {
    //   return;
    // }
    // this.setDefaultImage();
   }

   setDefaultImage() {
    switch (this.type) {
      case 'person':
        this.initial = this.initial.toUpperCase();
        this.getBackGroundColor();
        const svg1 = `<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
              <title>missing_profile_a</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Artboard" transform="translate(-127.000000, -429.000000)">
                      <g id="missing_profile_a" transform="translate(127.000000, 429.000000)">
                          <rect id="Rectangle-path" fill="${this.getBackGroundColor()}" fill-rule="nonzero" x="0" y="0" width="100" height="100"></rect>
                          <text id="A" fill="#FFFFFF" font-family="Helvetica" font-size="64.4749" font-weight="normal">
                              <tspan x="50%" y="75%" text-anchor="middle">${this.initial}</tspan>
                          </text>
                      </g>
                  </g>
              </g>
          </svg>`;
        const xml = svg1.replace(/#/g, '%23');
        this.ele.src = 'data:image/svg+xml;charset=utf-8,' + xml;
        break;
      case 'group':
        this.ele.src = './assets/images/group-default.svg';
        break;
      case 'organisation':
        this.ele.src = './assets/images/organisation-default.svg';
        break;
    }
   }

   getBackGroundColor() {
    if (this.initial === 'P' || this.initial === 'A' || this.initial === 'F' || this.initial === 'K' || this.initial === 'U' || this.initial === 'Z') {
     return '#FF5630';
    } else if (this.initial === 'B' || this.initial === 'G' || this.initial === 'L' || this.initial === 'Q' || this.initial === 'V' || this.initial === '?') {
     return '#FFAB00';
    } else if (this.initial === 'C' || this.initial === 'H' || this.initial === 'M' || this.initial === 'R' || this.initial === 'W') {
     return '#36B37E';
    } else if (this.initial === 'D' || this.initial === 'I' || this.initial === 'N' || this.initial === 'S' || this.initial === 'X') {
     return '#00B8D9';
    } else if (this.initial === 'E' || this.initial === 'J' || this.initial === 'O' || this.initial === 'T' || this.initial === 'Y') {
     return '#6554C0';
    }
  }

}
