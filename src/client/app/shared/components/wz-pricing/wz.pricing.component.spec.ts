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

    describe('onSubmit()', () => {
      it('should emit the commitPricing event with the form', () => {
        spyOn(componentUnderTest.commitPricing, 'emit');
        componentUnderTest.onSubmit();

        expect(componentUnderTest.commitPricing.emit).toHaveBeenCalledWith(componentUnderTest.form);
      });
    });

    describe('parentIsEmpty()', () => {
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

    describe('validOptionsFor()', () => {
      it('should return if the optoin\'s parent is empty', () => {
        componentUnderTest.form = { 'A': '', 'B': '', 'C': '' };
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);

        expect(result).toBeUndefined();
      });

      it('should return valid options for the primary attribute', () => {
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[0]);

        expect(result).toEqual(mockOptions()[0].attributeList);
      });

      it('should return valid options for a non-primary attribute', () => {
        componentUnderTest.form = { 'A': 'R', 'B': '', 'C': '' };
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);

        expect(result).toEqual([{ name: 'J' }, { name: 'K' }, { name: 'L' }]);
      });

      it('should set the form value if there is only 1 valid child option', () => {
        componentUnderTest.form = { 'A': 'T', 'B': '', 'C': '' };
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);

        expect(result).toEqual([{name: 'N'}]);
        expect(componentUnderTest.form).toEqual({ 'A': 'T', 'B': 'N', 'C': '' });
      });
    });
  });

  function mockOptions() {
		return [
      {
        'primary': true,
        'id': 0,
        'name': 'A',
        'attributeList': [
          { name: 'R' },
          { name: 'S' },
          { name: 'T' }
        ],
        'validChildChoicesMap': {
          'R': ['J', 'K', 'L'],
          'S': ['K', 'L', 'M'],
          'T': ['N']
        },
        'childId': 1
      },
      {
        'id': 1,
        'name': 'B',
        'attributeList': [
          { name: 'J' },
          { name: 'K' },
          { name: 'L' },
          { name: 'M' },
          { name: 'N' }
        ],
        'validChildChoicesMap': {
          'J': ['U', 'V'],
          'K': ['V', 'W'],
          'L': ['W', 'X'],
          'M': ['X', 'Y'],
          'N': ['Y', 'Z']
        },
        'childId': 2
      },
      {
        'id': 2,
        'name': 'C',
        'attributeList': [
          { name: 'V' },
          { name: 'W' },
          { name: 'X' },
          { name: 'Y' },
          { name: 'Z' }
        ]
      }
    ];
	}
}
    