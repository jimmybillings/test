import { UiConfig } from './ui.config';

export function main() {
  xdescribe('Ui Config', () => {
    let configUnderTest: UiConfig;

    beforeEach(() => {
      configUnderTest = new UiConfig(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
