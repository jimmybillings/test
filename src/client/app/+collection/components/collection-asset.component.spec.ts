import { CollectionAssetComponent } from './collection-asset.component';

export function main() {
  describe('Collection Asset Component', () => {
    let componentUnderTest: CollectionAssetComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionAssetComponent(null, null);
    });

    it('has no testable functionality!', () => {
      expect(true).toBe(true);
    });
  });
}
