import {
  beforeEachProvidersArray,
  inject,
  addProviders
} from '../../../imports/test.imports';

import { WzListComponent } from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        WzListComponent
      ]);
    });

    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - false', inject([WzListComponent], (component: WzListComponent) => {
      spyOn(component.sort, 'emit');
      component.toggleFlag = 'false';
      component.sortBy('createdOn');
      expect(component.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: 'true' });
    }));

    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - true', inject([WzListComponent], (component: WzListComponent) => {
      spyOn(component.sort, 'emit');
      component.toggleFlag = 'true';
      component.sortBy('createdOn');
      expect(component.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: 'false' });
    }));
  });
}
