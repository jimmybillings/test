import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../../imports/test.imports';

import { WzListComponent } from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    let componentUnderTest: WzListComponent;
    beforeEach(() => {
      componentUnderTest = new WzListComponent();
    });


    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - false', () => {
      spyOn(componentUnderTest.sort, 'emit');
      componentUnderTest.toggleFlag = 'false';
      componentUnderTest.sortBy('createdOn');
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: 'true' });
    });

    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - true', () => {
      spyOn(componentUnderTest.sort, 'emit');
      componentUnderTest.toggleFlag = 'true';
      componentUnderTest.sortBy('createdOn');
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: 'false' });
    });

    it('Emit\'s an event that causes the edit form to display', () => {
      spyOn(componentUnderTest.editForm, 'emit');
      componentUnderTest.showEditForm({ record: 'test' });
      expect(componentUnderTest.editForm.emit).toHaveBeenCalledWith({ record: 'test' });
    });
  });
}
