import { UiConfig } from './ui.config';

export function main() {
  describe('Ui Config', () => {
    let configUnderTest: UiConfig;

    beforeEach(() => {
      configUnderTest = new UiConfig(null, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
