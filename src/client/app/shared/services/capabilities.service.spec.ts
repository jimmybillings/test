import { Capabilities } from './capabilities.service';

export function main() {
  xdescribe('Capabilities', () => {
    let serviceUnderTest: Capabilities;

    beforeEach(() => {
      serviceUnderTest = new Capabilities(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

