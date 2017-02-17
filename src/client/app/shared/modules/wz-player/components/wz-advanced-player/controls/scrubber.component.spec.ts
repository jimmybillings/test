import { ScrubberComponent } from './scrubber.component';

export function main() {
  describe('Scrubber Component', () => {
    let componentUnderTest: ScrubberComponent;

    beforeEach(() => {
      componentUnderTest = new ScrubberComponent(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
