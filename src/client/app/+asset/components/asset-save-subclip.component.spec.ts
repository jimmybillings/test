import { AssetSaveSubclipComponent } from './asset-save-subclip.component';

export function main() {
  xdescribe('Asset Save Subclip Component', () => {
    let componentUnderTest: AssetSaveSubclipComponent;

    beforeEach(() => {
      componentUnderTest = new AssetSaveSubclipComponent(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
