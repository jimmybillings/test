import { BadRequestComponent } from './bad-request.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: BadRequestComponent;

    beforeEach(() => {
      componentUnderTest = new BadRequestComponent(null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
