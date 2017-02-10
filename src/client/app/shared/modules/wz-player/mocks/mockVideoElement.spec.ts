import { MockVideoElement } from './mockVideoElement';

export function main() {
  describe('Mock Video Element', () => {
    let mockVideoElementUnderTest: MockVideoElement;

    beforeEach(() => {
      mockVideoElementUnderTest = new MockVideoElement(true);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
