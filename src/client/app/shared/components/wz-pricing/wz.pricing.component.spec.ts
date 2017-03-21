import { WzPricingComponent } from './wz.pricing.component';
import { Observable } from 'rxjs/Rx';
import { EventEmitter } from '@angular/core';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent;

    beforeEach(() => {
      componentUnderTest = new WzPricingComponent();
      componentUnderTest.attributes = mockOptions();
      componentUnderTest.pricingEvent = new EventEmitter();
      componentUnderTest.dialog = {
        close: jasmine.createSpy('close')
      };
    });

    describe('ngOnInit()', () => {
      it('should build the form properly with no preferences', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: '' }, { name: 'B', value: '' }, { name: 'C', value: '' }, { name: 'D', value: '' }
        ]);
      });

      it('should build the form properly with preferences', () => {
        componentUnderTest.pricingPreferences = {
          A: 'S',
          B: 'M',
          C: 'X',
          D: 'S'
        };
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: 'S' }, { name: 'B', value: 'M' }, { name: 'C', value: 'X' }, { name: 'D', value: 'S' }
        ]);
      });

      it('should build a blank form if the preferences are invalid', () => {
        componentUnderTest.pricingPreferences = {
          invalid: 'preference'
        };
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: '' }, { name: 'B', value: '' }, { name: 'C', value: '' }, { name: 'D', value: '' }
        ]);
      });
    });

    describe('onSubmit()', () => {
      it('should emit the calculatePricing event with the form', () => {
        componentUnderTest.ngOnInit();
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.usagePrice = Observable.of(10);
        componentUnderTest.onSubmit();

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({
          type: 'UPDATE_PREFERENCES',
          payload: { A: '', B: '', C: '', D: '' }
        });
      });
    });

    describe('parentIsEmpty()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should return false if the attribute is the parent of all other attribute', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[0]);

        expect(result).toBe(false);
      });

      it('should return true if the form value of the attributes parent is empty', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[1]);

        expect(result).toBe(true);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'something' },
          { name: 'B', value: 'something else' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[2]);

        expect(result).toBe(false);
      });

      it('should still work if fields are filled in', () => {
        componentUnderTest.form = [
          { name: 'A', value: 'something' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];

        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[2]);

        expect(result).toBe(true);
      });
    });

    describe('validOptionsFor()', () => {
      it('should return if the attributes parent is empty', () => {
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);
        expect(result).toBeUndefined();
      });

      it('should return valid options for the primary attribute', () => {
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[0]);

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

        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);

        expect(result).toEqual([{ name: 'J', value: 'J' }, { name: 'K', value: 'K' }, { name: 'L', value: 'L' }]);
      });

      it('should set the form value if there is only 1 valid child option', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.form = [
          { name: 'A', value: 'T' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ];

        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);

        expect(result).toEqual([{ name: 'N', value: 'N' }]);
        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: 'T' },
          { name: 'B', value: 'N' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ]);
      });

      it('should should emit an error and clear the form if there are no valid options', () => {
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.form = [
          { name: 'A', value: 'T' },
          { name: 'B', value: 'N' },
          { name: 'C', value: 'Z' },
          { name: 'D', value: '' }
        ];
        componentUnderTest.validOptionsFor(componentUnderTest.attributes[3]);

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({ type: 'ERROR', payload: 'PRICING.ERROR' });
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
          { name: 'A', value: 'R' },
          { name: 'B', value: 'J' },
          { name: 'C', value: 'V' },
          { name: 'D', value: 'Q' }
        ];
        expect(componentUnderTest.formIsInvalid).toBe(false);
      });
    });

    describe('handleSelect()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
        componentUnderTest.form = [
          { name: 'A', value: 'R' },
          { name: 'B', value: 'J' },
          { name: 'C', value: 'V' },
          { name: 'D', value: 'Q' }
        ];
      });

      it('should clear all the children of a given field', () => {
        let attribute: any = componentUnderTest.attributes[0];
        let option: any = attribute.attributeList[0];

        componentUnderTest.handleSelect(attribute, option);

        expect(componentUnderTest.form).toEqual([
          { name: 'A', value: 'R' },
          { name: 'B', value: '' },
          { name: 'C', value: '' },
          { name: 'D', value: '' }
        ]);
      });

      it('should calculate the price if the last field is filled in', () => {
        let attribute: any = componentUnderTest.attributes[3];
        let option: any = attribute.attributeList[0];
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.handleSelect(attribute, option);

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({
          type: 'CALCULATE_PRICE',
          payload: { A: 'R', B: 'J', C: 'V', D: 'Q' }
        });
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
          { name: 'R', value: 'R' },
          { name: 'S', value: 'S' },
          { name: 'T', value: 'T' }
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
          { name: 'J', value: 'J' },
          { name: 'K', value: 'K' },
          { name: 'L', value: 'L' },
          { name: 'M', value: 'M' },
          { name: 'N', value: 'N' }
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
          { name: 'V', value: 'V' },
          { name: 'W', value: 'W' },
          { name: 'X', value: 'X' },
          { name: 'Y', value: 'Y' },
          { name: 'Z', value: 'Z' }
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
          { name: 'Q', value: 'Q' },
          { name: 'R', value: 'R' },
          { name: 'S', value: 'S' },
          { name: 'T', value: 'T' }
        ]
      }
    ];
  }
}
