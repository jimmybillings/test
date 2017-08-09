import { MockJwPlayer } from './mockJwPlayer';

export function main() {
  xdescribe('Mock Jw Player', () => {
    let mockJwPlayerUnderTest: MockJwPlayer;

    beforeEach(() => {
      mockJwPlayerUnderTest = new MockJwPlayer();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
