import { QuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Edit Service', () => {
    let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockQuoteStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockQuoteStore = {
        data: Observable.of({ id: 3, ownerUserId: 10 }),
        state: { id: 3, ownerUserId: 10 },
        replaceQuoteWith: jasmine.createSpy('replaceQuoteWith'),
        updateQuoteWith: jasmine.createSpy('updateQuoteWith')
      };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteEditService(null, null);
    });

    it('should have no tests', () => {
      expect(true).toBe(true);
    });
  });
}
