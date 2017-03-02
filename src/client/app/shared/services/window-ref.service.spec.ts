import { WindowRef } from './window-ref.service';

export function main() {
  describe('Window Ref', () => {
    let serviceUnderTest: WindowRef;

    beforeEach(() => {
      serviceUnderTest = new WindowRef();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
