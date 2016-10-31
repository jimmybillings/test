import { SortDefinitionsService } from './sort-definitions.service';

export function main() {
  describe('Sort Definitions Service', () => {
    let serviceUnderTest: SortDefinitionsService;
    let mockStore: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockStore = { select: () => { return {}; } };

      serviceUnderTest = new SortDefinitionsService(null, mockStore);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

