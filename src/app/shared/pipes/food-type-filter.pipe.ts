import { Pipe, PipeTransform } from '@angular/core';
import { Addon, MenuItem } from 'src/app/modules/menu/model/menu';

@Pipe({
  name: 'foodTypeFilter'
})
export class FoodTypeFilterPipe implements PipeTransform {

  transform(data: (MenuItem | Addon)[], args: string): any {
    const selectedFoodTypes: Array<string> =  JSON.parse(args);
    if (selectedFoodTypes.length === 3) {
      return data;
    }
  
    // filter data array, data which match and return true will be
    // kept, false will be filtered out
    return data.filter(item => {
      return selectedFoodTypes.includes(item.foodType)
    })
  }

}
