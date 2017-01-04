import { NotFoundComponent } from './app.not-found.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: NotFoundComponent;

    beforeEach(() => {
      componentUnderTest = new NotFoundComponent(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
