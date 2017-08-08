import { AssetCapabilities } from './asset.capabilities';

export function main() {
  xdescribe('Asset Capabilities', () => {
    let capabilitiesUnderTest: AssetCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new AssetCapabilities(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

