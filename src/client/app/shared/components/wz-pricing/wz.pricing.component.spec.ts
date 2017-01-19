import { WzPricingComponent } from './wz.pricing.component';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent;

    beforeEach(() => {
      componentUnderTest = new WzPricingComponent();
      componentUnderTest.options = mockOptions();
      componentUnderTest.dialog = {
        close: jasmine.createSpy('close')
      };
    });

    describe('ngOnInit()', () => {
      it('should build the form properly', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: '' }, { name: 'B', value: '' }, { name: 'C', value: '' }, { name: 'D', value: '' }
        ]);
      });
    });

    describe('onSubmit()', () => {
      it('should emit the calculatePricing event with the form', () => {
        componentUnderTest.onSubmit();

        expect(componentUnderTest.dialog.close).toHaveBeenCalledWith({ attributes: componentUnderTest.form });
      });
    });

    describe('parentIsEmpty()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should return false if the option is the parent of all other options', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[0]);

        expect(result).toBe(false);
      });

      it('should return true if the form value of the option\'s parent is empty', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[1]);

        expect(result).toBe(true);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'something' },
          { name: 'B', value: 'something else' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[2]);

        expect(result).toBe(false);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'something' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];

        let result = componentUnderTest.parentIsEmpty(componentUnderTest.options[2]);

        expect(result).toBe(true);
      });
    });

    describe('validOptionsFor()', () => {
      it('should return if the options parent is empty', () => {
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);
        expect(result).toBeUndefined();
      });

      it('should return valid options for the primary attribute', () => {
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[0]);

        expect(result).toEqual(mockOptions()[0].attributeList);
      });

      it('should return valid options for a non-primary attribute', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.form = [
          { name: 'A', value: 'R' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];

        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);

        expect(result).toEqual([{ name: 'J' }, { name: 'K' }, { name: 'L' }]);
      });

      it('should set the form value if there is only 1 valid child option', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.form = [
          { name: 'A', value: 'T' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];

        let result = componentUnderTest.validOptionsFor(componentUnderTest.options[1]);

        expect(result).toEqual([{ name: 'N' }]);
        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: 'T' },
          { name: 'B', value: 'N' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ]);
      });

      it('should should emit an error and clear the form if there are no valid options', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'T' },
          { name: 'B', value: 'N' },
          { name: 'C', value: 'Z' },
          { name: 'D', value: '' }
        ];
        componentUnderTest.validOptionsFor(componentUnderTest.options[3]);

        expect(componentUnderTest.dialog.close).toHaveBeenCalledWith({ error: null });
        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: '' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ]);
      });
    });

    describe('formIsInvalid', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should return true if the the form is incomplete', () => {
        expect(componentUnderTest.formIsInvalid).toBe(true);
      });

      it('should return false if the the form is complete', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'FDAAF' },
          { name: 'B', value: 'ADS' },
          { name: 'C', value: 'ADSFSDf' },
          { name: 'D', value: 'ADFDF' }
        ];
        expect(componentUnderTest.formIsInvalid).toBe(false);
      });
    });

    describe('clearChildren()', () => {
      it('should clear all the children of a given field', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.form = [
          { name: 'A', value: 'FDAAF' },
          { name: 'B', value: 'ADS' },
          { name: 'C', value: 'ADSFSDf' },
          { name: 'D', value: 'ADFDF' }
        ];

        componentUnderTest.clearChildren(0);

        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: 'FDAAF' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ]);
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
