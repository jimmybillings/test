import { SearchCapabilities } from './search.capabilities';

export function main() {
  describe('Search Capabilities', () => {
    let capabilitiesUnderTest: SearchCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new SearchCapabilities(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

