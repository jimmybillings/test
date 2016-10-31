import { CollectionCapabilities } from './collection.capabilities';

export function main() {
  describe('Collection Capabilities', () => {
    let capabilitiesUnderTest: CollectionCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new CollectionCapabilities(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

