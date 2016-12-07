import { ValuesPipe } from './values.pipe';

export function main() {
  describe('Values Pipe', () => {
    let pipeUnderTest: ValuesPipe;

    beforeEach(() => {
      pipeUnderTest = new ValuesPipe();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
