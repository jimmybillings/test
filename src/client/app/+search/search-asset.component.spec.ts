import { SearchAssetComponent } from './search-asset.component';

export function main() {
  xdescribe('Search Asset Component', () => {
    let componentUnderTest: SearchAssetComponent;

    beforeEach(() => {
      componentUnderTest = new SearchAssetComponent();
    });

    xit('has no testable functionality!', () => {
      expect(true).toBe(true);
    });
  });
}
