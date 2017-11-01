import { WzPricingComponent } from './wz.pricing.component';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Wz Pricing Component', () => {
    let componentUnderTest: WzPricingComponent;
    let mockFormBuilder: any;
    let mockForm: any;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockFormBuilder = new FormBuilder();
      mockStore = new MockAppStore();
      mockStore.createStateSection('pricing', { attributes: mockPriceAttributes() });
      componentUnderTest = new WzPricingComponent(mockFormBuilder, mockStore);
      componentUnderTest.pricingEvent = new EventEmitter();
    });

    describe('pricingPreferences setter', () => {
      it('should build the form properly with no preferences', () => {
        componentUnderTest.pricingPreferences = {};

        expect(componentUnderTest.form.value).toEqual({ A: '' }); // disabled fields don't have a value
      });

      it('should build the form properly with preferences', () => {
        componentUnderTest.pricingPreferences = {
          A: 's',
          B: 'm',
          C: 'x',
          D: 's'
        };

        expect(componentUnderTest.form.value).toEqual({ A: 's', B: 'm', C: 'x', D: 's' });
      });

      it('should build a blank form if the preferences are invalid', () => {
        componentUnderTest.pricingPreferences = {
          invalid: 'preference'
        };
        expect(componentUnderTest.form.value).toEqual({ A: '' });
      });
    });

    describe('userCanCustomizeRights setter', () => {
      it('assigns the value of the input to the _userCanCustomizeRights variable', () => {
        componentUnderTest.userCanCustomizeRights = false;
        expect(componentUnderTest._userCanCustomizeRights).toBe(false);
      });

      describe('when the input is \'true\'', () => {
        it('builds the custom pricing attribute form', () => {
          componentUnderTest.pricingPreferences = {
            A: 's',
            B: 'm',
            C: 'x',
            D: 's'
          };
          componentUnderTest.userCanCustomizeRights = true;
          expect(componentUnderTest.customForm.value).toEqual({
            A: 's',
            attributes: 'B,m\nC,x\nD,s'
          });
        });
      });

      describe('when the input is \'false\'', () => {
        it('does not build the custom pricing attribute form', () => {
          componentUnderTest.userCanCustomizeRights = false;
          expect(componentUnderTest.customForm).toBeUndefined();
        });
      });
    });

    describe('onSubmit()', () => {
      it('should emit the calculatePricing event with the form', () => {
        componentUnderTest.pricingPreferences = {
          A: 's',
          B: 'm',
          C: 'x',
          D: 's'
        };
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.price = Observable.of(10);
        componentUnderTest.onSubmit();

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({
          type: 'APPLY_PRICE',
          payload: { price: 10, attributes: { A: 's', B: 'm', C: 'x', D: 's' }, updatePrefs: true }
        });
      });
    });

    describe('onSubmitCustom()', () => {
      it('should emit the pricing event with the form', () => {
        componentUnderTest.pricingPreferences = {
          A: 's',
          B: 'm',
          C: 'x',
          D: 's'
        };
        componentUnderTest.userCanCustomizeRights = true;
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.onSubmitCustom();

        expect(componentUnderTest.pricingEvent.emit).toHaveBeenCalledWith({
          type: 'APPLY_PRICE',
          payload: { attributes: { B: 'm', C: 'x', D: 's', A: 's' }, updatePrefs: false }
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
          A: ['s'],
          B: ['m'],
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
          A: ['r'],
          B: [''],
          C: [''],
          D: ['']
        });

        let result = componentUnderTest.validOptionsFor(componentUnderTest.attributes[1]);

        expect(result).toEqual([{ name: 'J', value: 'j' }, { name: 'K', value: 'k' }, { name: 'L', value: 'l' }]);
      });

      it('should should emit an error and clear the form if there are no valid options', () => {
        componentUnderTest.pricingPreferences = {};
        spyOn(componentUnderTest.pricingEvent, 'emit');
        componentUnderTest.form = mockFormBuilder.group({
          A: ['t'],
          B: ['n'],
          C: ['z'],
          D: ['']
        });

        componentUnderTest.validOptionsFor(componentUnderTest.attributes[3]);

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
          A: ['r'],
          B: ['j'],
          C: ['v'],
          D: ['q']
        });
      });

      it('should clear all the children of a given field if event is user input', () => {
        let attribute: any = componentUnderTest.attributes[0];
        componentUnderTest.handleSelect({ isUserInput: true } as any, attribute);

        expect(componentUnderTest.form.value).toEqual({
          A: 'r',
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
          { name: 'R', value: 'r' },
          { name: 'S', value: 's' },
          { name: 'T', value: 't' }
        ],
        'validChildChoicesMap': {
          'r': ['j', 'k', 'l'],
          's': ['k', 'l', 'm'],
          't': ['n']
        },
        'childId': 1
      },
      {
        'id': 1,
        'name': 'B',
        'displayName': 'B',
        'attributeList': [
          { name: 'J', value: 'j' },
          { name: 'K', value: 'k' },
          { name: 'L', value: 'l' },
          { name: 'M', value: 'm' },
          { name: 'N', value: 'n' }
        ],
        'validChildChoicesMap': {
          'j': ['u', 'v'],
          'k': ['v', 'w'],
          'l': ['w', 'x'],
          'm': ['x', 'y'],
          'n': ['y', 'z']
        },
        'childId': 2
      },
      {
        'id': 2,
        'name': 'C',
        'displayName': 'C',
        'attributeList': [
          { name: 'V', value: 'v' },
          { name: 'W', value: 'w' },
          { name: 'X', value: 'x' },
          { name: 'Y', value: 'y' },
          { name: 'Z', value: 'z' }
        ],
        'validChildChoicesMap': {
          'v': ['q'],
          'w': ['r'],
          'x': ['s'],
          'y': ['t']
        },
        'childId': 3
      },
      {
        'id': 3,
        'name': 'D',
        'displayName': 'D',
        'attributeList': [
          { name: 'Q', value: 'q' },
          { name: 'R', value: 'r' },
          { name: 'S', value: 's' },
          { name: 'T', value: 't' }
        ]
      }
    ];
  }
}
