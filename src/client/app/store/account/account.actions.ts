import { User, Account } from '../../shared/interfaces/user.interface';
import { Action } from '@ngrx/store';

export class ActionFactory {
  getAccountForQuoteAdmin(accountId: number): GetAccountForQuoteAdmin {
    return new GetAccountForQuoteAdmin(accountId);
  }
}

export class InternalActionFactory extends ActionFactory {
  getAccountForQuoteAdminSuccess(account: Account): GetAccountForQuoteAdminSuccess {
    return new GetAccountForQuoteAdminSuccess(account);
  }
}

export class GetAccountForQuoteAdmin implements Action {
  public static readonly Type = '[Account] Get Account For Quote Admin';
  public readonly type = GetAccountForQuoteAdmin.Type;
  constructor(public readonly accountId: number) { }
}

export class GetAccountForQuoteAdminSuccess implements Action {
  public static readonly Type = '[Account] Get Account For Quote Admin Success';
  public readonly type = GetAccountForQuoteAdminSuccess.Type;
  constructor(public readonly account: Account) { }
}

export type Any = GetAccountForQuoteAdmin | GetAccountForQuoteAdminSuccess;
