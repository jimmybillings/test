import { SpeedPreviewEffects } from './speed-preview.effects';

export function main() {
  xdescribe('Speed Preview Effects', () => {
    let effectsUnderTest: SpeedPreviewEffects;

    beforeEach(() => {
      effectsUnderTest = new SpeedPreviewEffects(null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
