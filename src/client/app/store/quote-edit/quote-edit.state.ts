import * as QuoteEditActions from './quote-edit.actions';
import * as AccountActions from '../account/account.actions';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';
import { Quote, QuoteRecipient } from '../../shared/interfaces/commerce.interface';

export interface State {
  data: Quote;
  loading: boolean;
  recipient?: QuoteRecipient;
}

export const initialState: State = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  },
  recipient: {
    user: {
      field: [{
        endPoint: "user/searchFields",
        queryParams: "fields,emailAddress,values",
        service: "identities",
        suggestionHeading: "Matching users",
        name: "emailAddress",
        label: "Email Address",
        type: "suggestions",
        value: "",
        validation: "REQUIRED"
      }]
    },
    billingAccount: {
      field: [{
        endPoint: "account/searchFields",
        queryParams: "fields,name,values",
        service: "identities",
        suggestionHeading: "Matching Accounts",
        name: "account",
        label: "Account",
        type: "suggestions",
        value: "",
        validation: "REQUIRED"
      }]
    },
    invoiceContact: {
      field: [{
        name: "invoiceContact",
        options: "",
        label: "Invoice Contact",
        type: "select",
        value: "",
        validation: "REQUIRED"
      }]
    }
  },
  loading: false
};

export type AllowedActions = AccountActions.Any | QuoteEditActions.Any;

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
        recipient: state.recipient
      };
    }

    case QuoteEditActions.AddUserToQuote.Type: {
      return {
        ...Common.clone(state),
        loading: false,
        recipient: Common.clone(Object.assign({}, state.recipient, {
          user: {
            id: action.user.id,
            name: `${action.user.firstName} ${action.user.lastName}`,
            email: action.user.emailAddress,
            field: state.recipient.user.field.map(field => {
              field.value = action.user.emailAddress;
              return field;
            })
          }
        }))
      };
    }

    case QuoteEditActions.GetBillingAccountSuccess.Type: {

      return {
        ...Common.clone(state),
        loading: false,
        recipient: Common.clone(Object.assign({}, state.recipient, {
          user: Object.assign(state.recipient.user, { accountName: action.billingAndInvoice.billingAccount.name }),
          billingAccount: {
            id: action.billingAndInvoice.billingAccount.id,
            name: action.billingAndInvoice.billingAccount.name,
            creditExemption: action.billingAndInvoice.billingAccount.creditExemption,
            licensingVertical: action.billingAndInvoice.billingAccount.licensingVertical,
            paymentTermsDays: action.billingAndInvoice.billingAccount.paymentTermsDays,
            purchaseOnCredit: action.billingAndInvoice.billingAccount.purchaseOnCredit,
            salesOwner: action.billingAndInvoice.billingAccount.salesOwner,
            field: state.recipient.billingAccount.field.map(field => {
              field.value = action.billingAndInvoice.billingAccount.name;
              return field;
            })
          },
          invoiceContact: {
            field: state.recipient.invoiceContact.field.map(field => {
              field.value = `${action.billingAndInvoice.invoiceContactId.firstName} ${action.billingAndInvoice.invoiceContactId.lastName}`
              field.options = `${action.billingAndInvoice.invoiceContactId.firstName} ${action.billingAndInvoice.invoiceContactId.lastName}`
              return field;
            })
          }
        }))
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
