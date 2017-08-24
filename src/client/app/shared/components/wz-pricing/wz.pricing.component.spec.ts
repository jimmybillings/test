import { WzPricingComponent } from './wz.pricing.component';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent, mockFormBuilder: any, mockForm: any;

    beforeEach(() => {
      mockFormBuilder = new FormBuilder();
      componentUnderTest = new WzPricingComponent(mockFormBuilder);
      componentUnderTest.attributes = mockPriceAttributes() as any;
      componentUnderTest.pricingEvent = new EventEmitter();
    });

    describe('pricingPreferences setter', () => {
      it('should build the form properly with no preferences', () => {
        componentUnderTest.pricingPreferences = {};

        expect(componentUnderTest.form.value).toEqual({ A: '' }); // disabled fields don't have a value
      });

      it('should build the form properly with preferences', () => {
        componentUnderTest.pricingPreferences = {
          A: 'S',
          B: 'M',
          C: 'X',
          D: 'S'
        };

        expect(componentUnderTest.form.value).toEqual({ A: 'S', B: 'M', C: 'X', D: 'S' });
      });

      it('should build a blank form if the preferences are invalid', () => {
        componentUnderTest.pricingPreferences = {
          invalid: 'preference'
        };
        expect(componentUnderTest.form.value).toEqual({ A: '' });
      });
    });

    describe('onSubmit()', () => {
      it('should emit the calculatePricing event with the form', () => {
        componentUnderTest.pricingPreferences = {
          A: 'S',
          B: 'M',
          C: 'X',
          D: 'S'
        };
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.usagePrice = Observable.of(10);
        componentUnderTest.onSubmit();

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({
          type: 'APPLY_PRICE',
          payload: { price: 10, attributes: { A: 'S', B: 'M', C: 'X', D: 'S' } }
        });
      });
    });

    describe('parentIsEmpty()', () => {
      beforeEach(() => {
        componentUnderTest.pricingPreferences = {};
      });

      it('should return false if the attribute is the parent of all other attribute', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[0]);

        expect(result).toBe(false);
      });

      it('should return true if the form value of the attributes parent is empty', () => {
        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[1]);

        expect(result).toBe(true);
      });

      it('should return false if the parent is not empty', () => {
        componentUnderTest.form = mockFormBuilder.group({
          A: ['S'],
          B: ['M'],
          C: [''],
          D: ['']
        });

        let result = componentUnderTest.parentIsEmpty(componentUnderTest.attributes[2]);

        expect(result).toBe(false);
      });
    });

    describe('validOptionsFor()', () => {
      it('should return if the attributes parent is empty', () => {
        componentUnderTest.pricingPreferences = {};
        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);
        expect(result).toBeUndefined();
      });

      it('should return valid options for the primary attribute', () => {
        componentUnderTest.pricingPreferences = {};
        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[0]);

        expect(result).toEqual(mockPriceAttributes()[0].attributeList);
      });

      it('should return valid options for a non-primary attribute', () => {
        componentUnderTest.pricingPreferences = {};
        componentUnderTest.form = mockFormBuilder.group({
          A: ['R'],
          B: [''],
          C: [''],
          D: ['']
        });

        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);

        expect(result).toEqual([{ name: 'J', value: 'J' }, { name: 'K', value: 'K' }, { name: 'L', value: 'L' }]);
      });

      it('should should emit an error and clear the form if there are no valid options', () => {
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.form = mockFormBuilder.group({
          A: ['T'],
          B: ['N'],
          C: ['Z'],
          D: ['']
        });

        componentUnderTest.validOptionsFor(componentUnderTest.attributes[3]);

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({ type: 'ERROR', payload: 'PRICING.ERROR' });
        expect(componentUnderTest.form.value).toEqual({
          A: '',
          B: '',
          C: '',
          D: ''
        });
      });
    });

    describe('handleSelect()', () => {
      beforeEach(() => {
        componentUnderTest.pricingPreferences = {};
        componentUnderTest.form = mockFormBuilder.group({
          A: ['R'],
          B: ['J'],
          C: ['V'],
          D: ['Q']
        });
      });

      it('should clear all the children of a given field if event is user input', () => {
        let attribute: any = componentUnderTest.attributes[0];
        componentUnderTest.handleSelect({ isUserInput: true } as any, attribute);

        expect(componentUnderTest.form.value).toEqual({
          A: 'R',
          B: ''
        });
      });
    });
  });

  function mockPriceAttributes() {
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
