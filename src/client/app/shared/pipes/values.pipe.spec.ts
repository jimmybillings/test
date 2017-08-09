import { ValuesPipe } from './values.pipe';

export function main() {
  xdescribe('Values Pipe', () => {
    let pipeUnderTest: ValuesPipe;

    beforeEach(() => {
      pipeUnderTest = new ValuesPipe();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
