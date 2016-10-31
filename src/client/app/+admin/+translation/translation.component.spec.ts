import { TranslationComponent } from './translation.component';

export function main() {
  describe('Translation Component', () => {
    let componentUnderTest: TranslationComponent;

    beforeEach(() => {
      componentUnderTest = new TranslationComponent(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

