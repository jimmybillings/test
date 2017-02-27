import { UiConfig } from './ui.config';

export function main() {
  describe('Ui Config', () => {
    let configUnderTest: UiConfig;

    beforeEach(() => {
      configUnderTest = new UiConfig(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
