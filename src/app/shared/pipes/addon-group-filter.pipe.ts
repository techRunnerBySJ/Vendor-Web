import { Pipe, PipeTransform } from '@angular/core';
import { AddonGroup } from 'src/app/modules/menu/model/menu';

@Pipe({
  name: 'addonGroupFilter'
})
export class AddonGroupFilterPipe implements PipeTransform {

  transform(data: AddonGroup[], args: string): any {
    const selectedFoodTypes: Array<string> = JSON.parse(args);
    if (selectedFoodTypes.length === 3) {
      return data;
    }
    data = data.filter(addonGroup => {
      let addonCount = 0;
      if (!addonGroup.addons.length) {
        return addonGroup
      }
      addonGroup.addons.forEach(addon => {
        if (selectedFoodTypes.includes(addon.foodType)) {
          addonCount++;
        }
      })
      if (addonCount > 0) {
        return addonGroup
      }
    })
    return data;
  }

}
