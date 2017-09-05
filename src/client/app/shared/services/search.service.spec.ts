import { SearchService } from './search.service';

export function main() {
  describe('Search Service', () => {
    let serviceUnderTest: SearchService;
    let searchStore: any = { data: 'test' };
    beforeEach(() => {
      serviceUnderTest = new SearchService(null, null, searchStore, null, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
