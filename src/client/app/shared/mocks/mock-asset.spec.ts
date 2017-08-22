import { SomeClass } from './mock-asset';

export function main() {
  xdescribe('Some Class', () => {
    let assetUnderTest: SomeClass;

    beforeEach(() => {
      assetUnderTest = new SomeClass(null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
