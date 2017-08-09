import { SearchService } from './search.service';

export function main() {
  xdescribe('Search Service', () => {
    let serviceUnderTest: SearchService;
    let searchStore: any = { data: 'test' };
    beforeEach(() => {
      serviceUnderTest = new SearchService(null, null, searchStore, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
