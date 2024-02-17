import { Pipe, PipeTransform } from '@angular/core';
import { Menu } from 'src/app/modules/menu/model/menu';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  transform(data: Menu[], args: string): any {
    const selectedFoodTypes: Array<string> =  JSON.parse(args);
    if (selectedFoodTypes.length === 3) {
      return data;
    }
    data = data.filter(category => {
      if (!category.subCategories.length) return category;

      let subCategoryCount = 0;
      for (const sub of category.subCategories) {
        if (!sub.menuItems.length) return category;
        
        let itemCount = 0;
        for(const item of sub.menuItems) {
          if (selectedFoodTypes.includes(item.foodType)) {
            itemCount++;
          }
        }
        if (itemCount > 0) {
          subCategoryCount++
        }
      }
      if (subCategoryCount > 0) {
        return category;
      }
    })
    return data;
  }

}
