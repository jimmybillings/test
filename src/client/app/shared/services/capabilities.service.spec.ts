import { Capabilities } from './capabilities.service';

export function main() {
  describe('Capabilities', () => {
    let serviceUnderTest: Capabilities;

    beforeEach(() => {
      serviceUnderTest = new Capabilities(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

