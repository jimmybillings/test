import { WzSortComponent } from './wz.sort.component';

export function main() {
  xdescribe('Wz Sort Component', () => {
    let componentUnderTest: WzSortComponent;

    beforeEach(() => {
      componentUnderTest = new WzSortComponent();
    });

    xit('has no tests!', () => {
      spyOn(componentUnderTest.sort, 'emit');
      componentUnderTest.applySort('newSortDef');
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith('newSortDef');
    });
  });
};

