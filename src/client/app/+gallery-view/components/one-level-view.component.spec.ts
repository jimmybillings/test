import { OneLevelViewComponent } from './one-level-view.component';

export function main() {
  describe('One Level View Component', () => {
    let componentUnderTest: OneLevelViewComponent;

    beforeEach(() => {
      componentUnderTest = new OneLevelViewComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
