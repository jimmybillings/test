import { QuoteFormComponent } from './quote-form.component';

export function main() {
  describe('Quote Form Component', () => {
    let componentUnderTest: QuoteFormComponent;

    beforeEach(() => {
      componentUnderTest = new QuoteFormComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
