import { MockJwPlayer } from './mockJwPlayer';

export function main() {
  describe('Mock Jw Player', () => {
    let mockJwPlayerUnderTest: MockJwPlayer;

    beforeEach(() => {
      mockJwPlayerUnderTest = new MockJwPlayer();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
