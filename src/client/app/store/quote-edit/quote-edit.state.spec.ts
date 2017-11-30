import { SendDetails } from '../../shared/interfaces/commerce.interface';
import * as QuoteEditActions from './quote-edit.actions';
import * as QuoteState from './quote-edit.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';
import * as UserActions from '../user/user.actions';
import * as AccountActions from '../account/account.actions';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Edit Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteState,
      actions: QuoteEditActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['Load', 'Delete', 'CloneQuote', 'CreateQuote', 'UpdateQuoteFields', 'AddFeeTo', 'RemoveFee',
        'BulkImport', 'EditLineItem', 'AddAssetToProjectInQuote', 'AddProject', 'RemoveProject', 'UpdateProject',
        'MoveLineItem', 'CloneLineItem', 'EditLineItemMarkers'],
      customTests: [
        {
          it: 'returns a clone of the state with loading: true',
          previousState: QuoteState.initialState,
          expectedNextState: { ...QuoteState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: [
        'LoadSuccess', 'DeleteSuccess', 'EditLineItemFromDetailsSuccess', 'RemoveAssetSuccess',
        'AddCustomPriceToLineItemSuccess', 'CloneQuoteSuccess', 'BulkImportSuccess',
        'AddAssetToProjectInQuoteSuccess', 'RefreshAndNotify'
      ],
      customTests: [
        {
          it: 'returns the state with the requested quote and loading: false',
          previousState: { ...QuoteState.initialState, loading: true },
          actionParameters: { quote: { some: 'quote' } },
          expectedNextState: { data: { some: 'quote' }, sendDetails: QuoteState.initialState.sendDetails, loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['LoadFailure', 'DeleteFailure', 'EditLineItemFromDetailsFailure',
        'AddCustomPriceToLineItemFailure'],
      mutationTestData: {
        previousState: { loading: true }
      },
      customTests: [
        {
          it: 'returns a clone of the state with loading: false',
          previousState: { ...QuoteState.initialState, loading: true },
          expectedNextState: { ...QuoteState.initialState, sendDetails: QuoteState.initialState.sendDetails, loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['AddUserToQuote'],
      mutationTestData: {
        previousState: QuoteState.initialState,
        actionParameters: { user: { id: 1, firstName: 'test', lastName: 'user', emailAddress: 'test@email.com' } }
      },
      customTests: [
        {
          it: 'Adds user properties to the sendDetails and updates the user field value with current user',
          previousState: QuoteState.initialState,
          actionParameters: { user: { id: 1, firstName: 'test', lastName: 'user', emailAddress: 'test@email.com' } },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              user: {
                id: 1,
                customerName: 'test user',
                email: 'test@email.com',
                field: [{
                  endPoint: 'user/searchFields',
                  queryParams: 'fields,emailAddress,values',
                  service: 'identities',
                  suggestionHeading: 'Matching users',
                  name: 'emailAddress',
                  label: 'QUOTE.EDIT.FORMS.RECIPIENT_EMAIL_LABEL',
                  type: 'suggestions',
                  value: 'test@email.com',
                  validation: 'REQUIRED'
                }]
              }
            }
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      overrideActionClass: UserActions,
      actionClassName: ['GetAllUsersByAccountIdSuccess'],
      mutationTestData: {
        actionParameters: {
          users: [
            { id: 1, user: 'test', emailAddress: 'email1@test.com' },
            { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
            { id: 3, user: 'test 3', emailAddress: 'email3@test.com' }
          ]
        }
      },
      customTests: [
        {
          it: 'Adds a list of matching users to a drop down and selects the user id that matches the invoiceId as active',
          previousState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                ...QuoteState.initialState.sendDetails.billingAccount,
                invoiceContactId: 2
              },
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                field: [{
                  name: 'invoiceContact',
                  options: '',
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: null,
                  validation: 'REQUIRED'
                }]
              }
            }
          },
          actionParameters: {
            users: [
              { id: 1, user: 'test', emailAddress: 'email1@test.com' },
              { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
              { id: 3, user: 'test 3', emailAddress: 'email3@test.com' }
            ]
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                ...QuoteState.initialState.sendDetails.billingAccount,
                invoiceContactId: 2
              },
              invoiceContact: {
                contactEmail: 'email2@test.com',
                field: [{
                  name: 'invoiceContact',
                  options: [
                    { id: 1, user: 'test', emailAddress: 'email1@test.com' },
                    { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
                    { id: 3, user: 'test 3', emailAddress: 'email3@test.com' }
                  ],
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
                  validation: 'REQUIRED'
                }]
              }
            }
          }
        },
        {
          it: 'Sets form element value to an empty string if there is no invoiceContactId and subsquently no matching user',
          previousState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                field: [{
                  name: 'invoiceContact',
                  options: '',
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: null,
                  validation: 'REQUIRED'
                }]
              }
            }
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              invoiceContact: {
                contactEmail: null,
                field: [{
                  name: 'invoiceContact',
                  options: [],
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: '',
                  validation: 'REQUIRED'
                }]
              }
            }
          }
        },
        {
          it: 'Sets form element value to an empty string if there is no user that matches the invoiceContactId',
          previousState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                ...QuoteState.initialState.sendDetails.billingAccount,
                invoiceContactId: 4
              },
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                field: [{
                  name: 'invoiceContact',
                  options: '',
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: null,
                  validation: 'REQUIRED'
                }]
              }
            }
          },
          actionParameters: {
            users: [
              { id: 1, user: 'test', emailAddress: 'email1@test.com' },
              { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
              { id: 3, user: 'test 3', emailAddress: 'email3@test.com' }
            ]
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                ...QuoteState.initialState.sendDetails.billingAccount,
                invoiceContactId: 4
              },
              invoiceContact: {
                contactEmail: null,
                field: [{
                  name: 'invoiceContact',
                  options: [
                    { id: 1, user: 'test', emailAddress: 'email1@test.com' },
                    { id: 2, user: 'test 2', emailAddress: 'email2@test.com' },
                    { id: 3, user: 'test 3', emailAddress: 'email3@test.com' }
                  ],
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: '',
                  validation: 'REQUIRED'
                }]
              }
            }
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['AddInvoiceContactToQuote'],
      mutationTestData: {
        actionParameters: { userId: 1 }
      },
      customTests: [
        {
          it: 'Adds the selected user as the invoiceContactId on the quote as well as updating the corresponding form field value',
          previousState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                field: [{
                  name: 'invoiceContact',
                  options: [
                    { id: 1, name: 'test', emailAddress: 'email1@test.com' },
                    { id: 2, name: 'test 2', emailAddress: 'email2@test.com' },
                    { id: 3, name: 'test 3', emailAddress: 'email3@test.com' }
                  ],
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: '',
                  validation: 'REQUIRED'
                }]
              }
            }
          },
          actionParameters: { userId: 1 },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                field: [{
                  name: 'invoiceContact',
                  options: [
                    { id: 1, name: 'test', emailAddress: 'email1@test.com' },
                    { id: 2, name: 'test 2', emailAddress: 'email2@test.com' },
                    { id: 3, name: 'test 3', emailAddress: 'email3@test.com' }
                  ],
                  label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
                  type: 'select',
                  value: { id: 1, name: 'test', emailAddress: 'email1@test.com' },
                  validation: 'REQUIRED'
                }],
                id: 1,
                contactEmail: 'email1@test.com',
                name: 'test'
              }
            }
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      overrideActionClass: AccountActions,
      actionClassName: ['GetAccountForQuoteAdminSuccess'],
      mutationTestData: {
        actionParameters: {
          account: {
            name: 'Wazee Account',
            salesOwner: 'testOwner',
            purchaseOnCredit: 100,
            creditExemption: 100,
            paymentTermsDays: 20,
            licensingVertical: 'yes',
            invoiceContactId: 1
          }
        }
      },
      customTests: [
        {
          it: `Adds new account to state, updates form element with new account name as the value, 
          adds invoiceContactId property value to ID property on invoice contact object`,
          previousState: {
            ...QuoteState.initialState
          },
          actionParameters: {
            account: {
              name: 'Wazee Account',
              salesOwner: 'testOwner',
              purchaseOnCredit: 100,
              creditExemption: 100,
              paymentTermsDays: 20,
              licensingVertical: 'yes',
              invoiceContactId: 1
            }
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                name: 'Wazee Account',
                salesOwner: 'testOwner',
                purchaseOnCredit: 100,
                creditExemption: 100,
                paymentTermsDays: 20,
                licensingVertical: 'yes',
                invoiceContactId: 1,
                field: [{
                  endPoint: 'account/searchFields',
                  queryParams: 'fields,name,values',
                  service: 'identities',
                  suggestionHeading: 'Matching accounts',
                  name: 'account',
                  label: 'QUOTE.EDIT.FORMS.ACCOUNT_NAME_LABEL',
                  type: 'suggestions',
                  value: 'Wazee Account',
                  validation: 'REQUIRED'
                }]
              },
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                id: 1
              }
            }
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      overrideActionClass: AccountActions,
      actionClassName: ['GetAccountForQuoteAdminOnUserAddSuccess'],
      mutationTestData: {
        actionParameters: {
          account: {
            name: 'Wazee Account',
            salesOwner: 'testOwner',
            purchaseOnCredit: 100,
            creditExemption: 100,
            paymentTermsDays: 20,
            licensingVertical: 'yes',
            invoiceContactId: 1
          }
        }
      },
      customTests: [
        {
          it: `After adding a new user, automatically adds the users account to the state, updates form 
          element with new account name as the value, adds invoiceContactId property value to ID 
          property on invoice contact object and adds the accountName property to the user state`,
          previousState: {
            ...QuoteState.initialState
          },
          actionParameters: {
            account: {
              name: 'Wazee Account',
              salesOwner: 'testOwner',
              purchaseOnCredit: 100,
              creditExemption: 100,
              paymentTermsDays: 20,
              licensingVertical: 'yes',
              invoiceContactId: 1
            }
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              billingAccount: {
                name: 'Wazee Account',
                salesOwner: 'testOwner',
                purchaseOnCredit: 100,
                creditExemption: 100,
                paymentTermsDays: 20,
                licensingVertical: 'yes',
                invoiceContactId: 1,
                field: [{
                  endPoint: 'account/searchFields',
                  queryParams: 'fields,name,values',
                  service: 'identities',
                  suggestionHeading: 'Matching accounts',
                  name: 'account',
                  label: 'QUOTE.EDIT.FORMS.ACCOUNT_NAME_LABEL',
                  type: 'suggestions',
                  value: 'Wazee Account',
                  validation: 'REQUIRED'
                }]
              },
              invoiceContact: {
                ...QuoteState.initialState.sendDetails.invoiceContact,
                id: 1
              },
              user: {
                ...QuoteState.initialState.sendDetails.user,
                accountName: 'Wazee Account'
              }
            }
          }
        }
      ]
    });


    stateSpecHelper.generateTestsFor({
      actionClassName: ['InitializeSalesManagerFormOnQuote'],
      mutationTestData: {
        actionParameters: { emailAddress: 'email@test.com', defaultDate: '2018/12/12' }
      },
      customTests: [
        {
          it: 'Initializes sales manager form with current user and adds current user and default date to the state',
          previousState: {
            ...QuoteState.initialState,
          },
          actionParameters: { emailAddress: 'email@test.com', defaultDate: '2018/12/12' },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              salesManager: {
                expirationDate: '2018/12/12',
                salesManager: 'email@test.com',
                offlineAgreement: null,
                field: [{
                  default: 'TODAY+15',
                  name: 'expirationDate',
                  label: 'QUOTE.EDIT.FORMS.EXPIRATION_DATE_LABEL',
                  type: 'wzdate',
                  minimum: 'TODAY',
                  validation: 'REQUIRED'
                },
                {
                  name: 'salesManager',
                  label: 'QUOTE.EDIT.FORMS.SALES_MANAGER_LABEL',
                  type: 'email',
                  value: 'email@test.com',
                  validation: 'EMAIL'
                }, {
                  name: 'offlineAgreementReference',
                  label: 'QUOTE.EDIT.FORMS.OFFLINE_AGREEMENT_LABEL',
                  type: 'text',
                  value: '',
                  validation: 'OPTIONAL'
                }]
              }
            }
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['UpdateSalesManagerFormOnQuote'],
      mutationTestData: {
        actionParameters: {
          form: {
            salesManager: 'email@test.com',
            expirationDate: '2018/12/12',
            offlineAgreementReference: 'SD12FJ23GJ23'
          }
        }
      },
      customTests: [
        {
          it: 'Initializes sales manager form with current user and adds current user and default date to the state',
          previousState: {
            ...QuoteState.initialState,
          },
          actionParameters: {
            form: {
              salesManager: 'email@test.com',
              expirationDate: '2018/12/12',
              offlineAgreementReference: 'SD12FJ23GJ23'
            }
          },
          expectedNextState: {
            ...QuoteState.initialState,
            sendDetails: {
              ...QuoteState.initialState.sendDetails,
              salesManager: {
                field: [
                  {
                    name: 'expirationDate',
                    label: 'QUOTE.EDIT.FORMS.EXPIRATION_DATE_LABEL',
                    type: 'wzdate',
                    minimum: 'TODAY',
                    validation: 'REQUIRED',
                    value: '2018/12/12',
                    default: '2018/12/12'
                  },
                  {
                    name: 'salesManager',
                    label: 'QUOTE.EDIT.FORMS.SALES_MANAGER_LABEL',
                    type: 'email',
                    value: 'email@test.com',
                    validation: 'EMAIL'
                  }, {
                    name: 'offlineAgreementReference',
                    label: 'QUOTE.EDIT.FORMS.OFFLINE_AGREEMENT_LABEL',
                    type: 'text',
                    value: 'SD12FJ23GJ23',
                    validation: 'OPTIONAL'
                  }
                ],
                expirationDate: '2018/12/12',
                salesManager: 'email@test.com',
                offlineAgreement: 'SD12FJ23GJ23'
              }
            }
          }
        }
      ]
    });
  });
}
