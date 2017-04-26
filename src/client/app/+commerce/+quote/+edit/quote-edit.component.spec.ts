import { QuoteEditComponent } from './quote-edit.component';

export function main() {
  describe('Quote Edit Component', () => {
    let componentUnderTest: QuoteEditComponent;

    beforeEach(() => {
      componentUnderTest = new QuoteEditComponent(null, null, null, null, null, null, null, null, null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
