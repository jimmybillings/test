import { WzFormBase } from './wz.form-base';

export function main() {
  describe('Wz Form Base', () => {
    let classUnderTest: WzFormBase;
    let mockForm: any;
    let mockFormModel: any;
    let mockFormBuilder: any;

    beforeEach(() => {
      mockForm = {
        controls: {}
      };

      mockFormModel = {
        create: jasmine.createSpy('create')
      };

      mockFormBuilder = {
        group: jasmine.createSpy('group').and.returnValue(mockForm)
      };

      classUnderTest = new WzFormBase(mockFormBuilder, mockFormModel, null);
    });

    describe('onSelectChange()', () => {
      let selectField: any;
      let otherField: any;

      beforeEach(() => {
        selectField = { options: 'zero,one', slaveFieldName: 'otherFieldName', slaveFieldValues: ['slaveZero', 'slaveOne'] };
        otherField = { value: 'slaveZero', setValue: (newValue: any) => otherField.value = newValue };
        mockForm.controls = { otherFieldName: otherField };

        classUnderTest.ngOnInit();
      });

      it('updates a slave field based on this field\'s selection', () => {
        classUnderTest.onSelectChange({ value: 'one' }, selectField);

        expect(otherField.value).toEqual('slaveOne');
      });

      it('does nothing if the select field\'s options property is missing', () => {
        delete selectField.options;
        classUnderTest.onSelectChange({ value: 'one' }, selectField);

        expect(otherField.value).toEqual('slaveZero');
      });

      it('does nothing if the select field\'s slaveFieldName property is missing', () => {
        delete selectField.slaveFieldName;
        classUnderTest.onSelectChange({ value: 'one' }, selectField);

        expect(otherField.value).toEqual('slaveZero');
      });

      it('does nothing if the select field\'s slaveFieldValues property is missing', () => {
        delete selectField.slaveFieldValues;
        classUnderTest.onSelectChange({ value: 'one' }, selectField);

        expect(otherField.value).toEqual('slaveZero');
      });
    });

    describe('onDollarsInput()', () => {
      let event: any;
      const getCursorPositionIn: Function = (string: string) => {
        const position: number = string.indexOf('|');
        return position === -1 ? string.length : position;
      };

      beforeEach(() => {
        event = { target: {} };
      });

      // In these tests, a pipe ('|') in the input represents the current cursor position, which is just to
      // the right of the most recent character the user typed.  No pipe implies that the cursor is at the end.
      //
      // Examples:
      // - An input of '1|23' means that the value was previously '23', and then the user moved the cursor
      //   just left of the '2' and then typed a '1'.  So the cursor is between the '1' and '2'.
      // - An input of '123' means that the value was previously '12', and then the user moved the cursor to
      //   just right of the '2' (or just left cursor there) and typed a '3'.  So the cursor is right of the '3'.
      //
      // Note that we don't need to represent a selected set of characters, because when an "input" event
      // is triggered, the selection must have been replaced by 0-1 characters, and there is no selection anymore.
      //
      // Also, note that input values can come in one big chunk, in the form of a paste operation.  Thus, inputs like
      // '1.2.3.4' can happen, even if they can't happen one character at a time.
      //
      let tests: any = [
        { name: 'accepts an empty string', input: '', output: '' },
        { name: 'accepts numbers', input: '1234567890', output: '1234567890' },
        { name: 'accepts a decimal point', input: '123.45', output: '123.45' },
        { name: 'accepts a decimal point at the end', input: '123.', output: '123.' },
        { name: 'accepts initial decimal point', input: '.', output: '.' },
        { name: 'removes a leading zero', input: '02', output: '2' },
        { name: 'removes multiple leading zeros', input: '00002', output: '2' },
        { name: 'removes all but one zero if only zeros exist', input: '0000', output: '0' },
        { name: 'accepts zero by itself', input: '0', output: '0' },
        { name: 'accepts zero and decimal point only', input: '0.', output: '0.' },
        { name: 'rejects second decimal point', input: '1.25.', output: '1.25' },
        { name: 'rejects second decimal point after zero', input: '0..', output: '0.' },
        { name: 'rejects all but one decimal point', input: '1.2.3.4', output: '1.23' },
        { name: 'rejects more than two digits after decimal point', input: '1.501', output: '1.50' },
        { name: 'rejects an initial letter', input: 'a', output: '' },
        { name: 'rejects a later letter', input: '123a', output: '123' },
        { name: 'rejects a inserted letter', input: '1a|23', output: '1|23' },
        { name: 'rejects a bunch of bad characters at once', input: '0X0e28.5yX2XX.37p', output: '28.52' },
        { name: 'accepts an inserted decimal point', input: '12.|34', output: '12.|34' },
        { name: 'accepts a decimal point inserted left of the first digit', input: '.|1234', output: '.|12' },
        { name: 'accepts a decimal point inserted just right of the first digit', input: '1.|234', output: '1.|23' },
        { name: 'rejects decimal point inserted before an existing one', input: '12.|34.56', output: '12|34.56' },
        { name: 'rejects decimal point inserted after an existing one', input: '1234.5.|6', output: '1234.5|6' },
        {
          name: 'rejects decimal point inserted before multiple others, and the rightmost excess ones (latter can\'t happen?)',
          input: '12.|34.5..6', output: '12|34.56'
        },
        { name: 'accepts an inserted number', input: '12340|5678', output: '12340|5678' }
      ];

      for (const test of tests) {
        it(test.name, () => {
          event.target.value = test.input.replace('|', '');
          event.target.selectionStart = event.target.selectionEnd = getCursorPositionIn(test.input);

          classUnderTest.onDollarsInput(event);

          expect(event.target.value).toEqual(test.output.replace('|', ''));
          expect(event.target.selectionStart).toEqual(getCursorPositionIn(test.output));
          expect(event.target.selectionEnd).toEqual(event.target.selectionStart);
        });
      }
    });
  });
}
