import { CartUtilities } from './cart.utilities';

export function main() {
  describe('Cart Utilities', () => {
    describe('nextNewProjectNameGiven()', () => {
      it('returns expected values', () => {
        let tests: Array<any> = [
          [[], 'Project A'],
          [['Project A'], 'Project B'],
          [['Project A', 'Project B'], 'Project C'],
          [['Project B'], 'Project C'],
          [['Project A', 'Project G'], 'Project H'],
          [['Project A', 'Project Z'], 'Project AA'],
          [['My Project'], 'Project B'],
          [['My Project', 'My Other Project'], 'Project C'],
          [['Project A', 'My Project'], 'Project C'],
          [['My Project', 'Project B'], 'Project C'],
          [['My Project', 'Project B', 'My Other Project'], 'Project D']
        ];

        tests.forEach(params => {
          expect(CartUtilities.nextNewProjectNameGiven(params[0]))
            .toEqual(params[1], `input was [${params[0].map((param: string) => `'${param}'`).join(', ')}]`);
        });
      });
    });

    describe('compareLetterCodes()', () => {
      it('returns expected values', () => {
        let tests: Array<any> = [
          ['A', 'B', -1], ['A', 'A', 0], ['B', 'A', 1],
          ['Z', 'AA', -1], ['AA', 'Z', 1],
          ['AA', 'AB', -1], ['AB', 'AA', 1],
          ['ZA', 'AAA', -1], ['AAA', 'ZA', 1]
        ];

        tests.forEach(params => {
          expect(CartUtilities.compareLetterCodes(params[0], params[1]))
            .toEqual(params[2], `input was ${params[0]}, ${params[1]}`);
        });
      });
    });

    describe('letterCodeFor()', () => {
      it('returns expected letter codes', () => {
        let tests: Array<any> = [
          [0, 'A'], [1, 'B'], [2, 'C'],
          [25, 'Z'], [26, 'AA'], [27, 'AB'], [28, 'AC'],
          [51, 'AZ'], [52, 'BA'], [53, 'BB'], [54, 'BC'],
          [77, 'BZ'], [78, 'CA'], [79, 'CB'], [80, 'CC'],
          [701, 'ZZ'], [702, 'AAA'], [703, 'AAB']
        ];

        tests.forEach(params => {
          expect(CartUtilities.letterCodeFor(params[0]))
            .toEqual(params[1], `input was ${params[0]}`);
        });
      });
    });
  });
};
