import { CollectionContextService } from './collection-context.service';

export function main() {
  describe('Collection Context Service', () => {
    let serviceUnderTest: CollectionContextService;
    let mockStore: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockStore = { select: () => { return {}; } };

      serviceUnderTest = new CollectionContextService(mockStore);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
