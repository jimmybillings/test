import { Observable } from 'rxjs/Observable';
import { MockAppStore } from '../../../../../store/spec-helpers/mock-app.store';
import { QuoteEditSendTabComponent } from './quote-edit-send-tab.component';

export function main() {
  describe('Quote Edit Send Tab Component', () => {
    let componentUnderTest: QuoteEditSendTabComponent;
    let sendQuoteDispatchSpy: jasmine.Spy;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();

      mockStore.createStateSection('uiConfig', {
        components: {
          quoteComment: { config: { form: { items: [{ some: 'config' }] } } },
          cart: {
            config: {
              form: { items: ['comment', 'stuff'] },
              createQuote: { items: [{ name: 'purchaseType', value: '' }] },
              addBulkOrderId: { items: [{ some: 'bulk' }] },
              addDiscount: { items: [{ some: 'discount' }] },
              addCostMultiplier: { items: [{ some: 'multiplier' }] },
              bulkImport: { items: [{ some: 'import' }] },
              quotePurchaseType: { items: [{ value: 'SystemLicense', viewValue: 'System License' }] }
            }
          }
        }
      });

      mockStore.createStateSection('uiConfig', {
        components: {
          cart: { config: { items: 'form items' } }
        }
      });

      sendQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'saveRecipientInformationOnQuote');

      componentUnderTest =
        new QuoteEditSendTabComponent(mockStore);
    });

  });
}
