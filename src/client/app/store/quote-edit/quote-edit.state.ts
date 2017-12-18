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
        label: 'QUOTE.EDIT.FORMS.RECIPIENT_EMAIL_LABEL',
        type: 'suggestions',
        value: '',
        validation: 'REQUIRED'
      }]
    },
    billingAccount: {
      purchaseOnCredit: null,
      creditExemption: null,
      licensingVertical: null,
      field: [{
        endPoint: 'account/searchFields',
        queryParams: 'fields,name,values',
        service: 'identities',
        suggestionHeading: 'Matching accounts',
        name: 'name',
        label: 'QUOTE.EDIT.FORMS.ACCOUNT_NAME_LABEL',
        type: 'suggestions',
        value: '',
        validation: 'REQUIRED'
      }, {
        name: 'salesOwner',
        label: 'QUOTE.EDIT.SALES_OWNER_KEY',
        type: 'text',
        value: '',
        validation: 'REQUIRED'
      }, {
        name: 'paymentTermsDays',
        label: 'QUOTE.EDIT.PAYMENT_TERMS_DAYS_KEY',
        type: 'number',
        value: '',
        validation: 'REQUIRED',
        min: 0,
        max: 0
      }]
    },
    invoiceContact: {
      contactEmail: null,
      name: null,
      field: [{
        name: 'invoiceContact',
        options: [],
        label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
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
        label: 'QUOTE.EDIT.FORMS.EXPIRATION_DATE_LABEL',
        type: 'wzdate',
        minimum: 'TODAY',
        validation: 'REQUIRED'
      },
      {
        name: 'salesManager',
        label: 'QUOTE.EDIT.FORMS.SALES_MANAGER_LABEL',
        type: 'email',
        value: '',
        validation: 'EMAIL'
      }, {
        name: 'offlineAgreementReference',
        label: 'QUOTE.EDIT.FORMS.OFFLINE_AGREEMENT_LABEL',
        type: 'textarea',
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
        sendDetails: {
          ...Common.clone(state.sendDetails)
        }
      };
    }

    case QuoteEditActions.AddUserToQuote.Type: {
      const clonedState = Common.clone(state);
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          user: {
            id: action.user.id,
            customerName: `${action.user.firstName} ${action.user.lastName}`,
            email: action.user.emailAddress,
            field: clonedState.sendDetails.user.field.map(field => (
              { ...field, value: action.user.emailAddress }
            ))
          }
        }
      };
    }

    case AccountActions.GetAccountForQuoteAdminSuccess.Type: {
      const clonedState = Common.clone(state);
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          billingAccount: {
            ...action.account,
            field: clonedState.sendDetails.billingAccount.field.map(field => (
              { ...field, value: action.account[field.name] }
            ))
          },
          invoiceContact: {
            ...clonedState.sendDetails.invoiceContact,
            id: action.account.invoiceContactId
          }
        }
      };
    }

    case AccountActions.GetAccountForQuoteAdminOnUserAddSuccess.Type: {
      const clonedState = Common.clone(state);
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          billingAccount: {
            ...action.account,
            field: clonedState.sendDetails.billingAccount.field.map(field => {
              if (field.hasOwnProperty('max')) {
                field = { ...field, max: action.account.paymentTermsDays };
              }
              return { ...field, value: action.account[field.name] };
            }),
          },
          invoiceContact: {
            ...clonedState.sendDetails.invoiceContact,
            id: action.account.invoiceContactId
          },
          user: {
            ...clonedState.sendDetails.user,
            accountName: action.account.name
          }
        }
      };
    }

    case UserActions.GetAllUsersByAccountIdSuccess.Type: {
      const clonedState = Common.clone(state);
      let selectedUser: User;
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          invoiceContact: {
            ...clonedState.sendDetails.invoiceContact,
            field: clonedState.sendDetails.invoiceContact.field.map(item => {
              item.options = (action.users || []);

              item.value = item.options.find((option: Pojo) =>
                option.id === clonedState.sendDetails.billingAccount.invoiceContactId) || '';

              if (item.value !== '') selectedUser = item.value;

              return item;
            }),
            contactEmail: (selectedUser) ? selectedUser.emailAddress : null,
            name: (selectedUser) ? selectedUser.name : null
          }
        }
      };
    }

    case QuoteEditActions.AddInvoiceContactToQuote.Type: {
      const clonedState = Common.clone(state);
      let selectedUser: User;
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          invoiceContact: {
            ...clonedState.sendDetails.invoiceContact,
            id: action.userId,
            field: clonedState.sendDetails.invoiceContact.field.map(field => {
              selectedUser = field.options.find((option: Pojo) => option.id === action.userId);
              field.value = selectedUser;
              return field;
            }),
            contactEmail: (selectedUser) ? selectedUser.emailAddress : null,
            name: (selectedUser) ? selectedUser.name : null
          }
        }
      };
    }

    case QuoteEditActions.InitializeSalesManagerFormOnQuote.Type: {
      const clonedState = Common.clone(state);
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          salesManager: {
            ...clonedState.sendDetails.salesManager,
            field: clonedState.sendDetails.salesManager.field.map(field => {
              if (field.type === 'email') field.value = action.emailAddress;
              return field;
            }),
            expirationDate: action.defaultDate,
            salesManager: action.emailAddress
          }
        }
      };
    }

    case QuoteEditActions.UpdateSalesManagerFormOnQuote.Type: {
      const clonedState = Common.clone(state);
      return {
        ...clonedState,
        sendDetails: {
          ...clonedState.sendDetails,
          salesManager: {
            field: clonedState.sendDetails.salesManager.field.map(field => {
              return (field.type === 'wzdate') ?
                { ...field, default: action.form[field.name], value: action.form[field.name] } :
                { ...field, value: action.form[field.name] };
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

    case QuoteEditActions.UpdateBillingAccount.Type: {
      // const clonedState: State = Common.clone(state);

      return {
        ...state,
        sendDetails: {
          ...state.sendDetails,
          billingAccount: {
            ...state.sendDetails.billingAccount,
            ...action.form,
            // field: state.sendDetails.billingAccount.field.map(field => (
            //   { ...field, value: action.form[field.name] }
            // ))
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}
