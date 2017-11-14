import { User } from '../../shared/interfaces/user.interface';
import * as QuoteEditActions from './quote-edit.actions';
import * as AccountActions from '../account/account.actions';
import * as UserActions from '../user/user.actions';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';
import { Quote, SendDetails, SendDetailsUser } from '../../shared/interfaces/commerce.interface';

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
      invoiceContactId: null,
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
        options: '',
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
        ...state,
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

    case QuoteEditActions.AddUserToQuote.Type: {
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          user: {
            id: action.user.id,
            customerName: `${action.user.firstName} ${action.user.lastName}`,
            email: action.user.emailAddress,
            field: state.sendDetails.user.field.map(field => {
              field.value = action.user.emailAddress;
              return field;
            })
          }
        }
      };
    }

    case UserActions.GetAllUsersByAccountIdSuccess.Type: {
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          invoiceContact: {
            ...Common.clone(state.sendDetails.invoiceContact),
            field: state.sendDetails.invoiceContact.field.map(field => {
              field.options = (action.users || []);
              if (state.sendDetails.billingAccount.hasOwnProperty('invoiceContactId')) {
                field.value = field.options.find((option: Pojo) => option.id === state.sendDetails.billingAccount.invoiceContactId);
              } else {
                field.value = '';
              }
              return field;
            }),
            contactEmail: state.sendDetails.invoiceContact.field[0].value.emailAddress || null
          }
        }
      };
    }

    case QuoteEditActions.AddInvoiceContactToQuote.Type: {
      let selectedUser: User;
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          invoiceContact: {
            ...Common.clone(state.sendDetails.invoiceContact),
            id: action.userId,
            field: state.sendDetails.invoiceContact.field.map(field => {
              selectedUser = field.options.find((option: Pojo) => option.id === action.userId);
              field.value = selectedUser;
              return field;
            }),
            contactEmail: selectedUser.emailAddress,
            name: selectedUser.name
          }
        }
      };
    }

    case AccountActions.GetAccountForQuoteAdminSuccess.Type: {

      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          billingAccount: {
            ...Common.clone(action.account),
            field: state.sendDetails.billingAccount.field.map(field => {
              field.value = action.account.name;
              return field;
            })
          },
          invoiceContact: {
            ...Common.clone(state.sendDetails.invoiceContact),
            id: action.account.invoiceContactId
          }
        }
      };
    }

    case AccountActions.GetAccountForQuoteAdminOnUserAddSuccess.Type: {
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          billingAccount: {
            ...Common.clone(action.account),
            field: state.sendDetails.billingAccount.field.map(field => {
              field.value = action.account.name;
              return field;
            })
          },
          invoiceContact: {
            ...Common.clone(state.sendDetails.invoiceContact),
            id: action.account.invoiceContactId
          },
          user: {
            ...Common.clone(state.sendDetails.user),
            accountName: action.account.name
          }
        }
      };
    }

    case QuoteEditActions.AddSalesManagerToQuote.Type: {
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          salesManager: {
            ...Common.clone(state.sendDetails.salesManager),
            field: state.sendDetails.salesManager.field.map(field => {
              if (field.type === 'email') field.value = action.emailAddress;
              return field;
            })
          }
        }
      };
    }

    case QuoteEditActions.UpdateSalesManagerFormOnQuote.Type: {
      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          salesManager: {
            field: state.sendDetails.salesManager.field.map(field => {
              if (field.type === 'wzdate') field.default = action.form[field.name];
              field.value = action.form[field.name];
              return field;
            }),
            expirationDate: action.form.expirationDate,
            salesManager: action.form.salesManager,
            offlineAgreement: action.form.offlineAgreementReference,
          }
        }
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
