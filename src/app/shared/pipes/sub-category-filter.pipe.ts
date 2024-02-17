import { Pipe, PipeTransform } from '@angular/core';
import { SubCategory } from 'src/app/modules/menu/model/menu';

@Pipe({
  name: 'subCategoryFilter'
})
export class SubCategoryFilterPipe implements PipeTransform {

  transform(data: SubCategory[], args: string): any {
    const selectedFoodTypes: Array<string> =  JSON.parse(args);
    if (selectedFoodTypes.length === 3) {
      return data;
    }

    return data.filter(sub => {
      if (!sub.menuItems.length) return sub;
      let itemCount = 0;
      sub.menuItems.forEach(item => {
        if (selectedFoodTypes.includes(item.foodType)) {
          itemCount++;
        }
      })
      if (itemCount > 0) {
        return sub
      }
    })
  }

}
