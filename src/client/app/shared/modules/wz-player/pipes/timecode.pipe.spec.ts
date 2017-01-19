import { TimecodePipe } from './timecode.pipe';

export function main() {
  describe('Timecode Pipe', () => {
    let pipeUnderTest: TimecodePipe;

    beforeEach(() => {
      pipeUnderTest = new TimecodePipe();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
