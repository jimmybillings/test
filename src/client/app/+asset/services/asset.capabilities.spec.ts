import { AssetCapabilities } from './asset.capabilities';

export function main() {
  describe('Asset Capabilities', () => {
    let capabilitiesUnderTest: AssetCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new AssetCapabilities(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

