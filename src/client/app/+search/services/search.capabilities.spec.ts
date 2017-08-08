import { SearchCapabilities } from './search.capabilities';

export function main() {
  xdescribe('Search Capabilities', () => {
    let capabilitiesUnderTest: SearchCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new SearchCapabilities(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

