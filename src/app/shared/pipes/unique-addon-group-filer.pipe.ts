import { Pipe, PipeTransform } from '@angular/core';
import { AddonGroup } from 'src/app/modules/menu/model/menu';

@Pipe({
  name: 'uniqueAddonGroupFiler'
})
export class UniqueAddonGroupFilerPipe implements PipeTransform {

  transform(addonGroups: AddonGroup[], filter: any[]): any {
    if (!addonGroups || !filter) {
      return addonGroups;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return addonGroups.filter(addonGroup => { 
      return filter.indexOf(addonGroup.addonGroupId) < 0;
    });
  }

}
