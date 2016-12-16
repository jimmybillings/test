import { WzPricingComponent } from './wz.pricing.component';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent;

    beforeEach(() => {
      componentUnderTest = new WzPricingComponent();
      componentUnderTest.form = {
        'A': '',
        'B': '',
        'C': ''
      };
      componentUnderTest.options = mockOptions();
    });

    describe('parentIsEmpty', () => {
      it('should return false if the option is the parent of all other options', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[0]);

        expect(result).toBe(false);
      });

      it('should return true if the form value of the option\'s parent is empty', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[1]);

        expect(result).toBe(true);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = { 'A': 'something', 'B': 'something else', 'C': '' };

        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[2]);

        expect(result).toBe(false);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = { 'A': 'something', 'B': '', 'C': '' };

        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[2]);

        expect(result).toBe(true);
      });
    });
  });

  function mockOptions() {
		return [
      {
        'parent': true,
        'id': 0,
        'name': 'A',
        'attributeList': [
          { name: 'R' },
          { name: 'S' },
          { name: 'T' }
        ],
        'validChildChoicesMap': {
          'X': [ 'J', 'K', 'L' ],
          'Y': [ 'K', 'L', 'M' ],
          'Z': [ 'L', 'M', 'N' ]
        },
        'childId': 1
      },
      {
        'id': 1,
        'name': 'B',
        'attributeList': [
          { name: 'U' },
          { name: 'V' },
          { name: 'W' }
        ],
        'validChildChoicesMap': {
          'U': [ 'G', 'H', 'I' ],
          'V': [ 'H', 'I', 'J' ],
          'W': [ 'I', 'J', 'K' ]
        },
        'childId': 2
      },
      {
        'id': 2,
        'name': 'C',
        'attributeList': [
          { name: 'X' },
          { name: 'Y' },
          { name: 'Z' }
        ],
        'validChildChoicesMap': {
          'X': [ 'D', 'E', 'F' ],
          'Y': [ 'E', 'F', 'G' ],
          'Z': [ 'F', 'G', 'H' ]
        }
      }
    ];
	}
}
    