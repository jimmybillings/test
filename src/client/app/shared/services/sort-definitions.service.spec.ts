import { SortDefinitionsService } from './sort-definitions.service';

export function main() {
  xdescribe('Sort Definitions Service', () => {
    let serviceUnderTest: SortDefinitionsService;
    let mockStore: any, mockUserPreference: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockStore = { select: () => { return {}; } };
      mockUserPreference = { state: { sortId: 1 } };

      serviceUnderTest = new SortDefinitionsService(null, mockStore, mockUserPreference);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

