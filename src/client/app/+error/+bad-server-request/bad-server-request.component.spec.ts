import { BadServerRequestComponent } from './bad-server-request.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: BadServerRequestComponent;

    beforeEach(() => {
      componentUnderTest = new BadServerRequestComponent(null);
    });

    it('***** DOESN\'T HAVE ANY TESTABLE FUNCTIONALITY! *****', () => {
      expect(true).toBe(true);
    });
  });
}
