import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { JoinPipe } from './join.pipe';
import { TitleizePipe } from './titleize.pipe';
import { AddonGroupFilterPipe } from './addon-group-filter.pipe';
import { FoodTypeFilterPipe } from './food-type-filter.pipe';
import { CategoryFilterPipe } from './category-filter.pipe';
import { SubCategoryFilterPipe } from './sub-category-filter.pipe';
import { UniqueAddonGroupFilerPipe } from './unique-addon-group-filer.pipe';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    JoinPipe,
    TitleizePipe,
    AddonGroupFilterPipe,
    FoodTypeFilterPipe,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
    UniqueAddonGroupFilerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddonGroupFilterPipe,
    FoodTypeFilterPipe,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
    UniqueAddonGroupFilerPipe
  ]
})
export class PipesModule { }
