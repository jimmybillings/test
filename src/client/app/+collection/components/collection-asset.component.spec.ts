import { CollectionAssetComponent } from './collection-asset.component';

export function main() {
  xdescribe('Collection Asset Component', () => {
    let componentUnderTest: CollectionAssetComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionAssetComponent();
    });

    xit('has no testable functionality!', () => {
      expect(true).toBe(true);
    });
  });
}
