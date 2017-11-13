import * as QuoteEditActions from './quote-edit.actions';
import * as AccountActions from '../account/account.actions';
import * as UserActions from '../user/user.actions';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';
import { Quote, SendDetails } from '../../shared/interfaces/commerce.interface';

export interface State {
  data: Quote;
  loading: boolean;
  sendDetails?: SendDetails;
}

export const initialState: State = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  },
  sendDetails: {
    user: {
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
      field: [{
        endPoint: 'account/searchFields',
        queryParams: 'fields,name,values',
        service: 'identities',
        suggestionHeading: 'Matching Accounts',
        name: 'account',
        label: 'Account name',
        type: 'suggestions',
        value: '',
        validation: 'REQUIRED'
      }]
    },
    invoiceContact: {
      email: '',
      field: [{
        name: 'invoiceContact',
        options: '',
        label: 'Invoice contact name',
        type: 'select',
        value: '',
        validation: 'REQUIRED'
      }]
    },
    salesManager: {
      field: [{
        default: 'TODAY+15',
        name: 'expirationDate',
        label: 'Expiration Date',
        type: 'wzdate',
        minimum: 'TODAY',
        validation: 'REQUIRED'
      },
      {
        name: 'salesManager',
        label: 'Sales Manager',
        type: 'email',
        value: '',
        validation: 'EMAIL'
      }, {
        name: 'offlineAgreementReference',
        label: 'Offline Agreement',
        type: 'text',
        value: '',
        validation: 'OPTIONAL'
      }]
    }
  },
  loading: false
};

export type AllowedActions = AccountActions.Any | QuoteEditActions.Any | UserActions.Any;

export function reducer(state: State = initialState, action: AllowedActions): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case QuoteEditActions.Delete.Type:
    case QuoteEditActions.Load.Type:
    case QuoteEditActions.CloneQuote.Type:
    case QuoteEditActions.CreateQuote.Type:
    case QuoteEditActions.UpdateQuoteFields.Type:
    case QuoteEditActions.AddFeeTo.Type:
    case QuoteEditActions.RemoveFee.Type:
    case QuoteEditActions.BulkImport.Type:
    case QuoteEditActions.EditLineItem.Type:
    case QuoteEditActions.AddAssetToProjectInQuote.Type:
    case QuoteEditActions.AddProject.Type:
    case QuoteEditActions.RemoveProject.Type:
    case QuoteEditActions.UpdateProject.Type:
    case QuoteEditActions.MoveLineItem.Type:
    case QuoteEditActions.CloneLineItem.Type:
    case QuoteEditActions.EditLineItemMarkers.Type: {
      return {
        ...Common.clone(state),
        loading: true
      };
    }

    case QuoteEditActions.EditLineItemFromDetailsSuccess.Type:
    case QuoteEditActions.AddCustomPriceToLineItemSuccess.Type:
    case QuoteEditActions.DeleteSuccess.Type:
    case QuoteEditActions.LoadSuccess.Type:
    case QuoteEditActions.RemoveAssetSuccess.Type:
    case QuoteEditActions.CloneQuoteSuccess.Type:
    case QuoteEditActions.BulkImportSuccess.Type:
    case QuoteEditActions.AddAssetToProjectInQuoteSuccess.Type:
    case QuoteEditActions.RefreshAndNotify.Type: {
      return {
        loading: false,
        data: {
          ...action.quote
        },
        sendDetails: state.sendDetails
      };
    }

    // SELECT USER START
    case QuoteEditActions.AddUserToQuote.Type: {
      return {
        ...state,
        loading: false,
        sendDetails: Common.clone(Object.assign({}, state.sendDetails, {
          user: {
            id: action.user.id,
            name: `${action.user.firstName} ${action.user.lastName}`,
            email: action.user.emailAddress,
            field: state.sendDetails.user.field.map(field => {
              field.value = action.user.emailAddress;
              return field;
            })
          }
        }))
      };
    }

    case QuoteEditActions.GetBillingAccountSuccess.Type: {
      console.log(action.billingAndInvoice.invoiceContactId.addressId);
      return {
        ...state,
        loading: false,
        sendDetails: Common.clone(Object.assign({}, state.sendDetails, {
          user: Object.assign(state.sendDetails.user, { accountName: action.billingAndInvoice.billingAccount.name }),
          billingAccount: {
            ...action.billingAndInvoice.billingAccount,
            field: state.sendDetails.billingAccount.field.map(field => {
              field.value = action.billingAndInvoice.billingAccount.name;
              return field;
            })
          },
          invoiceContact: {
            id: action.billingAndInvoice.invoiceContactId.addressId,
            field: state.sendDetails.invoiceContact.field.map(field => {
              field.value = {
                id: action.billingAndInvoice.invoiceContactId.addressId,
                name: `${action.billingAndInvoice.invoiceContactId.firstName} ${action.billingAndInvoice.invoiceContactId.lastName}`
              };
              return field;
            })
          }
        }))
      };
    }

    case UserActions.GetAllUsersByAccountIdSuccess.Type: {
      return {
        ...state,
        loading: false,
        sendDetails: Common.clone(Object.assign({}, state.sendDetails, {
          invoiceContact: Object.assign(state.sendDetails.invoiceContact, {
            field: state.sendDetails.invoiceContact.field.map(field => {
              field.options = (action.users || []).map(user => (
                { id: user.id, name: `${user.firstName} ${user.lastName}` }
              ));
              if (state.sendDetails.billingAccount.hasOwnProperty('invoiceContactId')) {
                field.value = field.options.find((option: Pojo) => option.id === state.sendDetails.billingAccount.invoiceContactId);
              }
              return field;
            })
          })
        }))
      };
    }

    case AccountActions.GetAccountForQuoteAdminSuccess.Type: {
      return {
        ...state,
        loading: false,
        sendDetails: Common.clone(Object.assign({}, state.sendDetails, {
          billingAccount: {
            id: action.account.id,
            name: action.account.name,
            creditExemption: action.account.creditExemption,
            licensingVertical: action.account.licensingVertical,
            paymentTermsDays: action.account.paymentTermsDays,
            purchaseOnCredit: action.account.purchaseOnCredit,
            invoiceContactId: action.account.invoiceContactId,
            salesOwner: action.account.salesOwner,
            field: state.sendDetails.billingAccount.field.map(field => {
              field.value = action.account.name;
              return field;
            })
          },
        }))
      };
    }

    case QuoteEditActions.AddSalesManagerToQuote.Type: {
      return {
        ...state,
        sendDetails: Object.assign(state.sendDetails, {
          salesManager: Object.assign(state.sendDetails.salesManager, {
            field: state.sendDetails.salesManager.field.map(field => {
              if (field.type === 'email') field.value = action.emailAddress;
              return field;
            })
          })
        })
      };
    }

    case QuoteEditActions.UpdateSalesManagerFormOnQuote.Type: {
      return {
        ...state,
        sendDetails: Object.assign(state.sendDetails, {
          salesManager: Object.assign(state.sendDetails.salesManager, {
            field: state.sendDetails.salesManager.field.map(field => {
              if (field.type === 'wzdate') field.default = action.form[field.name];
              field.value = action.form[field.name];
              return field;
            })
          })
        })
      };
    }

    case QuoteEditActions.AddInvoiceContactToQuote.Type: {
      return {
        ...state,
        sendDetails: Object.assign({}, state.sendDetails, {
          invoiceContact: Object.assign(state.sendDetails.invoiceContact, {
            id: action.userId
          })
        })
      };
    }

    case QuoteEditActions.DeleteFailure.Type:
    case QuoteEditActions.EditLineItemFromDetailsFailure.Type:
    case QuoteEditActions.AddCustomPriceToLineItemFailure.Type:
    case QuoteEditActions.LoadFailure.Type: {
      return {
        ...Common.clone(state),
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}
