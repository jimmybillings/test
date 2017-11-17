import { Observable } from 'rxjs/Observable';
import { MockAppStore } from '../../../../../store/spec-helpers/mock-app.store';
import { QuoteEditSendTabComponent } from './quote-edit-send-tab.component';
import {
  SendDetailsBillingAccount,
  SendDetailsInvoiceContact,
  SendDetailsSalesManager,
  SendDetailsUser,
} from '../../../../../shared/interfaces/commerce.interface';

function defaultDate(days: number) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10).replace(/-/g, '/');
}

export function main() {
  describe('Quote Edit Send Tab Component', () => {
    let componentUnderTest: QuoteEditSendTabComponent;
    let addUserToQuoteDispatchSpy: jasmine.Spy;
    let addBillingAccountToQuoteDispatchSpy: jasmine.Spy;
    let addInvoiceContactToQuoteDispatchSpy: jasmine.Spy;
    let updateSalesManagerFormOnQuoteDispatchSpy: jasmine.Spy;
    let initializeSalesManagerFormOnQuoteDispatchSpy: jasmine.Spy;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();

      mockStore.createStateSection('quoteEdit', {
        data: {},
        sendDetails: {
          user: {
            customerName: null,
            accountName: null,
            field: [{
              endPoint: 'user/searchFields',
              queryParams: 'fields,emailAddress,values',
              service: 'identities',
              suggestionHeading: 'Matching users',
              name: 'emailAddress',
              label: 'Recipient email address',
              type: 'suggestions',
              value: '',
              validation: 'REQUIRED'
            }]
          },
          billingAccount: {
            salesOwner: null,
            purchaseOnCredit: null,
            creditExemption: null,
            paymentTermsDays: null,
            licensingVertical: null,
            field: [{
              endPoint: 'account/searchFields',
              queryParams: 'fields,name,values',
              service: 'identities',
              suggestionHeading: 'Matching accounts',
              name: 'account',
              label: 'Account name',
              type: 'suggestions',
              value: '',
              validation: 'REQUIRED'
            }]
          },
          invoiceContact: {
            contactEmail: null,
            field: [{
              name: 'invoiceContact',
              options: [],
              label: 'Invoice contact name',
              type: 'select',
              value: '',
              validation: 'REQUIRED'
            }]
          },
          salesManager: {
            expirationDate: null,
            salesManager: null,
            offlineAgreement: null,
            field: [{
              default: 'TODAY+15',
              name: 'expirationDate',
              label: 'Expiration date',
              type: 'wzdate',
              minimum: 'TODAY',
              validation: 'REQUIRED'
            },
            {
              name: 'salesManager',
              label: 'Sales manager',
              type: 'email',
              value: '',
              validation: 'EMAIL'
            }, {
              name: 'offlineAgreementReference',
              label: 'Offline agreement reference',
              type: 'text',
              value: '',
              validation: 'OPTIONAL'
            }]
          }
        },
        loading: false
      });

      addUserToQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addUserToQuote');
      addBillingAccountToQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addBillingAccountToQuote');
      addInvoiceContactToQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addInvoiceContactToQuote');
      updateSalesManagerFormOnQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'updateSalesManagerFormOnQuote');
      initializeSalesManagerFormOnQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'initializeSalesManagerFormOnQuote');

      componentUnderTest =
        new QuoteEditSendTabComponent(mockStore, { state: { emailAddress: 'test email' } } as any);
    });

    describe('ngOnInit()', () => {
      describe('initializeSalesManagerForm()', () => {
        it('Should initialize the sales manager form with the current user and a default date', () => {
          componentUnderTest.ngOnInit();
          expect(initializeSalesManagerFormOnQuoteDispatchSpy).toHaveBeenCalledWith('test email', defaultDate(15));
        });
      });

      describe('monitorAndUpdateFormValidity()', () => {
        beforeEach(() => {
          componentUnderTest.invoiceContactform = {
            resetForm: jasmine.createSpy('resetForm'),
            markFieldsAsTouched: jasmine.createSpy('markFieldsAsTouched')
          } as any;
        });

        it('Should reset invoice contact form if the user account name matches the billing account', () => {
          mockStore.createStateSection('quoteEdit', {
            sendDetails: {
              user: {
                accountName: 'Test Account',
              },
              billingAccount: {
                name: 'Test Account',
                id: 1
              },
              invoiceContact: {}
            }
          });
          componentUnderTest.ngOnInit();
          expect(componentUnderTest.invoiceContactform.resetForm).toHaveBeenCalled();
          expect(componentUnderTest.invoiceContactform.markFieldsAsTouched).not.toHaveBeenCalled();
        });

        it(`Should mark invoice contact form as touched if the user account 
        name does not matche the billing account`, () => {
            mockStore.createStateSection('quoteEdit', {
              sendDetails: {
                user: {
                  accountName: 'Test 2 Account',
                },
                billingAccount: {
                  name: 'Test Account',
                  id: 1
                },
                invoiceContact: {}
              }
            });
            componentUnderTest.ngOnInit();
            expect(componentUnderTest.invoiceContactform.markFieldsAsTouched).toHaveBeenCalled();
            expect(componentUnderTest.invoiceContactform.resetForm).not.toHaveBeenCalled();
          });
      });
    });

    describe('get user()', () => {
      it('Should return an observable of the send details user', () => {
        let user: SendDetailsUser;
        componentUnderTest.user.subscribe(returnedUser => user = returnedUser);
        expect(user).toEqual({
          customerName: null,
          accountName: null,
          field: [{
            endPoint: 'user/searchFields',
            queryParams: 'fields,emailAddress,values',
            service: 'identities',
            suggestionHeading: 'Matching users',
            name: 'emailAddress',
            label: 'Recipient email address',
            type: 'suggestions',
            value: '',
            validation: 'REQUIRED'
          }]
        })
      });
    });

    describe('get billingAccount()', () => {
      it('Should return an observable of the send details user', () => {
        let billingAccount: SendDetailsBillingAccount;
        componentUnderTest.billingAccount.subscribe(returnedBillingAccount => billingAccount = returnedBillingAccount);
        expect(billingAccount).toEqual({
          salesOwner: null,
          purchaseOnCredit: null,
          creditExemption: null,
          paymentTermsDays: null,
          licensingVertical: null,
          field: [{
            endPoint: 'account/searchFields',
            queryParams: 'fields,name,values',
            service: 'identities',
            suggestionHeading: 'Matching accounts',
            name: 'account',
            label: 'Account name',
            type: 'suggestions',
            value: '',
            validation: 'REQUIRED'
          }]
        })
      });
    });

    describe('get invoiceContact()', () => {
      it('Should return an observable of the send details user', () => {
        let invoiceContact: SendDetailsInvoiceContact;
        componentUnderTest.invoiceContact.subscribe(returnedInvoiceContact => invoiceContact = returnedInvoiceContact);
        expect(invoiceContact).toEqual({
          contactEmail: null,
          field: [{
            name: 'invoiceContact',
            options: [],
            label: 'Invoice contact name',
            type: 'select',
            value: '',
            validation: 'REQUIRED'
          }]
        })
      });
    });

    describe('get salesManager()', () => {
      it('Should return an observable of the send details user', () => {
        let salesManager: SendDetailsSalesManager;
        componentUnderTest.salesManager.subscribe(returnedSalesManager => salesManager = returnedSalesManager);
        expect(salesManager).toEqual({
          expirationDate: null,
          salesManager: null,
          offlineAgreement: null,
          field: [{
            default: 'TODAY+15',
            name: 'expirationDate',
            label: 'Expiration date',
            type: 'wzdate',
            minimum: 'TODAY',
            validation: 'REQUIRED'
          },
          {
            name: 'salesManager',
            label: 'Sales manager',
            type: 'email',
            value: '',
            validation: 'EMAIL'
          }, {
            name: 'offlineAgreementReference',
            label: 'Offline agreement reference',
            type: 'text',
            value: '',
            validation: 'OPTIONAL'
          }]
        })
      });
    });

    describe('userSelect()', () => {
      it('Should dispatch addUserToQuote with a User', () => {
        componentUnderTest.userSelect({ user: 'some user' } as any);
        expect(addUserToQuoteDispatchSpy).toHaveBeenCalledWith({ user: 'some user' });
      });
    });

    describe('accountSelect()', () => {
      it('Should dispatch addBillingAccountToQuote with an Account', () => {
        componentUnderTest.accountSelect({ account: 'some account' } as any);
        expect(addBillingAccountToQuoteDispatchSpy).toHaveBeenCalledWith({ account: 'some account' });
      });
    });

    describe('invoiceContactSelect()', () => {
      it('Should dispatch addInvoiceContactToQuote with a value from event', () => {
        componentUnderTest.invoiceContactSelect({ value: 'some contact' } as any);
        expect(addInvoiceContactToQuoteDispatchSpy).toHaveBeenCalledWith('some contact');
      });
    });

    describe('onBlur()', () => {
      it('Should dispatch updateSalesManagerFormOnQuote with the sales manager form', () => {
        componentUnderTest.onBlur({ salesManger: 'some sales manager' } as any);
        expect(updateSalesManagerFormOnQuoteDispatchSpy).toHaveBeenCalledWith({ salesManger: 'some sales manager' });
      });
    });

    describe('get allBillingSelectionComplete()', () => {
      it('Should return true if the user account matches the selected billing account', () => {
        let billingSectionsComplete: Boolean;
        mockStore.createStateSection('quoteEdit', {
          sendDetails: {
            user: {
              accountName: 'Test Account',
            },
            billingAccount: {
              name: 'Test Account',
            }
          }
        });
        componentUnderTest.allBillingSelectionComplete.subscribe(complete => billingSectionsComplete = complete);
        expect(billingSectionsComplete).toEqual(true);
      });

      it('Should return true when invoice contact is selected and the user account doesnt match billing account', () => {
        let billingSectionsComplete: Boolean;
        mockStore.createStateSection('quoteEdit', {
          sendDetails: {
            user: {
              accountName: 'Test Account',
            },
            billingAccount: {
              name: 'Test 2 Account',
              id: 1
            },
            invoiceContact: {
              id: 3
            }
          }
        });
        componentUnderTest.allBillingSelectionComplete.subscribe(complete => billingSectionsComplete = complete);
        expect(billingSectionsComplete).toEqual(true);
      });

      it('Should return false if the user account does not match the selected billing account and there is no invoice contact', () => {
        let billingSectionsComplete: Boolean = false;
        mockStore.createStateSection('quoteEdit', {
          sendDetails: {
            user: {
              accountName: 'Test 2 Account',
            },
            billingAccount: {
              name: 'Test Account',
            }
          }
        });
        componentUnderTest.allBillingSelectionComplete.subscribe(complete => billingSectionsComplete = complete);
        expect(billingSectionsComplete).toEqual(false);
      });
    });

  });
}
