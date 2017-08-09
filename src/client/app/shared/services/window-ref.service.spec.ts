import { WindowRef } from './window-ref.service';

export function main() {
  xdescribe('Window Ref', () => {
    let serviceUnderTest: WindowRef;

    beforeEach(() => {
      serviceUnderTest = new WindowRef();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
