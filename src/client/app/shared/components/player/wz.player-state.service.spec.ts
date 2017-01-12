import { WzPlayerStateService } from './wz.player-state.service';

export function main() {
  describe('Wz Player State Service', () => {
    let serviceUnderTest: WzPlayerStateService;

    beforeEach(() => {
      serviceUnderTest = new WzPlayerStateService();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
