import { WzCollectionItemListComponent } from './wz.collection-item-list.component';

export function main() {
  xdescribe('Wz Collection Item List Component', () => {
    let componentUnderTest: WzCollectionItemListComponent;

    beforeEach(() => {
      componentUnderTest = new WzCollectionItemListComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

