import { FilterService } from './filter.service';

export function main() {
  xdescribe('Filter Service', () => {
    let serviceUnderTest: FilterService;
    let mockStore: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockStore = { select: () => { return {}; } };
      serviceUnderTest = new FilterService(null, mockStore, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
