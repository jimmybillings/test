import { TwoLevelViewComponent } from './two-level-view.component';

export function main() {
  describe('Two Level View Component', () => {
    let componentUnderTest: TwoLevelViewComponent;

    beforeEach(() => {
      componentUnderTest = new TwoLevelViewComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
