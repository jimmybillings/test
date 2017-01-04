import { WzPricingComponent } from './wz.pricing.component';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent;

    beforeEach(() => {
      componentUnderTest = new WzPricingComponent();
      componentUnderTest.options = mockOptions();
    });

    describe('onSubmit()', () => {
      it('should emit the calculatePricing event with the form', () => {
        spyOn(componentUnderTest.calculatePricing, 'emit');
        componentUnderTest.onSubmit();

        expect(componentUnderTest.calculatePricing.emit).toHaveBeenCalledWith(componentUnderTest.form);
      });
    });

    describe('parentIsEmpty()', () => {
      it('should return false if the option is the parent of all other options', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest._options[0]);

        expect(result).toBe(false);
      });

      it('should return true if the form value of the option\'s parent is empty', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest._options[1]);

        expect(result).toBe(true);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = { 'A': 'something', 'B': 'something else', 'C': '', 'D': '' };

        let result = componentUnderTest.parentIsEmpty(componentUnderTest._options[2]);

        expect(result).toBe(false);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = { 'A': 'something', 'B': '', 'C': '', 'D': '' };

        let result = componentUnderTest.parentIsEmpty(componentUnderTest._options[2]);

        expect(result).toBe(true);
      });
    });

    describe('validOptionsFor()', () => {
      it('should return if the options parent is empty', () => {
        let result = componentUnderTest.validOptionsFor(componentUnderTest._options[1]);

        expect(result).toBeUndefined();
      });

      it('should return valid options for the primary attribute', () => {
        let result = componentUnderTest.validOptionsFor(componentUnderTest._options[0]);

        expect(result).toEqual(mockOptions()[0].attributeList);
      });

      it('should return valid options for a non-primary attribute', () => {
        componentUnderTest.form = { 'A': 'R', 'B': '', 'C': '', 'D': '' };
        let result = componentUnderTest.validOptionsFor(componentUnderTest._options[1]);

        expect(result).toEqual([{ name: 'J' }, { name: 'K' }, { name: 'L' }]);
      });

      it('should set the form value if there is only 1 valid child option', () => {
        componentUnderTest.form = { 'A': 'T', 'B': '', 'C': '', 'D': '' };
        let result = componentUnderTest.validOptionsFor(componentUnderTest._options[1]);

        expect(result).toEqual([{name: 'N'}]);
        expect(componentUnderTest.form).toEqual({ 'A': 'T', 'B': 'N', 'C': '', 'D': '' });
      });

      it('should should emit an error and clear the form if there are no valid options', () => {
        spyOn(componentUnderTest.error, 'emit');
        componentUnderTest.form = { 'A': 'T', 'B': 'N', 'C': 'Z', 'D': '' };
        componentUnderTest.validOptionsFor(componentUnderTest._options[3]);

        expect(componentUnderTest.error.emit).toHaveBeenCalled();
        expect(componentUnderTest.form).toEqual({ 'A': '', 'B': '', 'C': '', 'D': '' });
      });
    });

    describe('formIsInvalid', () => {
      it('should return true if the the form is incomplete', () => {
        expect(componentUnderTest.formIsInvalid).toBe(true);
      });

      it('should return false if the the form is complete', () => {
        componentUnderTest.form = { 'A': 'asd', 'B': 'fsgsdf', 'C': 'gsfdg', 'D': 'hads' };
        expect(componentUnderTest.formIsInvalid).toBe(false);
      });
    });
  });

  function mockOptions() {
		return [
      {
        'primary': true,
        'id': 0,
        'name': 'A',
        'displayName': 'A',
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
        'displayName': 'B',
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
        'displayName': 'C',
        'attributeList': [
          { name: 'V' },
          { name: 'W' },
          { name: 'X' },
          { name: 'Y' },
          { name: 'Z' }
        ],
        'validChildChoicesMap': {
          'V': ['Q'],
          'W': ['R'],
          'X': ['S'],
          'Y': ['T']
        },
        'childId': 3
      },
      {
        'id': 3,
        'name': 'D',
        'displayName': 'D',
        'attributeList': [
          { name: 'Q' },
          { name: 'R' },
          { name: 'S' },
          { name: 'T' }
        ]
      }
    ];
	}
}
    