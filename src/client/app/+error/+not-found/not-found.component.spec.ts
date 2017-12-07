import { NotFoundComponent } from './not-found.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: NotFoundComponent;

    beforeEach(() => {
      componentUnderTest = new NotFoundComponent(null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
