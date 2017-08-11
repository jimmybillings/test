import { SpeedPreviewService } from './speed-preview.service';

export function main() {
  xdescribe('Speed Preview Service', () => {
    let serviceUnderTest: SpeedPreviewService;

    beforeEach(() => {
      serviceUnderTest = new SpeedPreviewService(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
