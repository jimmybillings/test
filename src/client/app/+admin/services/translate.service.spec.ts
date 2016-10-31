import { TranslateService } from './translate.service';

export function main() {
  describe('Translate Service', () => {
    let serviceUnderTest: TranslateService;

    beforeEach(() => {
      serviceUnderTest = new TranslateService(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

