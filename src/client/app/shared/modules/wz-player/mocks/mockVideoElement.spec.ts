import { MockVideoElement } from './mockVideoElement';

export function main() {
  xdescribe('Mock Video Element', () => {
    let mockVideoElementUnderTest: MockVideoElement;

    beforeEach(() => {
      mockVideoElementUnderTest = new MockVideoElement(true);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
