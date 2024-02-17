import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LimitToDirective} from './limit-to.directive';
import {SearchInputDirective} from './search-input.directive';
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { LazyLoadDirective } from './lazy-load.directive';
import { DefaultImageDirective } from './default-image.directive';
import { AllowTwoDecimalNumbersDirective } from './allow-two-decimal-numbers.directive';
import { AllowOnlyNumbers } from './allow-only-numbers.directive';


@NgModule({
  declarations: [
    LimitToDirective,
    SearchInputDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    DefaultImageDirective,
    AllowTwoDecimalNumbersDirective,
    AllowOnlyNumbers
  ],
  exports: [
    LimitToDirective,
    SearchInputDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    DefaultImageDirective,
    AllowTwoDecimalNumbersDirective,
    AllowOnlyNumbers
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule {
}
