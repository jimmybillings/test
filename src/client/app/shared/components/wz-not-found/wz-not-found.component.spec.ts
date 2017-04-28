import { WzNotFoundComponent } from './wz-not-found.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: WzNotFoundComponent;

    beforeEach(() => {
      componentUnderTest = new WzNotFoundComponent(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
