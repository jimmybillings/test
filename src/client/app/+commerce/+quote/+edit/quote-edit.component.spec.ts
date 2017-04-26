import { QuoteEditComponent } from './quote-edit.component';

export function main() {
  describe('Quote Edit Component', () => {
    let componentUnderTest: QuoteEditComponent;
    let mockQuoteEditService: any;

    beforeEach(() => {
      mockQuoteEditService = {
        addFeeTo: jasmine.createSpy('addFeeTo'),
        removeFee: jasmine.createSpy('removeFee')
      };

      componentUnderTest =
        new QuoteEditComponent(null, mockQuoteEditService, null, null, null, null, null, null, null, null, null, null);
    });

    describe('onNotification()', () => {
      describe('ADD_QUOTE_FEE', () => {
        it('calls the addFeeTo() service method', () => {
          componentUnderTest.onNotification(
            { type: 'ADD_QUOTE_FEE', payload: { project: { some: 'project' }, fee: { some: 'fee' } } }
          );

          expect(mockQuoteEditService.addFeeTo).toHaveBeenCalledWith({ some: 'project' }, { some: 'fee' });
        });

        it('throws an error if the message doesn\'t have a payload', () => {
          expect(() => componentUnderTest.onNotification({ type: 'ADD_QUOTE_FEE' })).toThrowError();
        });
      });

      describe('REMOVE_QUOTE_FEE', () => {
        it('calls the removeFee() service method', () => {
          componentUnderTest.onNotification(
            { type: 'REMOVE_QUOTE_FEE', payload: { some: 'fee' } }
          );

          expect(mockQuoteEditService.removeFee).toHaveBeenCalledWith({ some: 'fee' });
        });
      });
    });
  });
}
