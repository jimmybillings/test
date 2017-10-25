import { Action } from '@ngrx/store';
import { Asset } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public showHelpRequest(assetName: Asset['name']): ShowHelpRequest {
    return new ShowHelpRequest(assetName);
  }

  public SubmitHelpRequest(formItems: any): SubmitHelpRequest {
    return new SubmitHelpRequest(formItems);
  }

}

export class InternalActionFactory extends ActionFactory {
}

export class ShowHelpRequest implements Action {
  public static readonly Type = '[Help Request] Show Help Request';
  public readonly type = ShowHelpRequest.Type;
  constructor(public readonly assetName: Asset['name']) { }
}

export class SubmitHelpRequest implements Action {
  public static readonly Type = '[Help Request] Submit Help Request';
  public readonly type = SubmitHelpRequest.Type;
  constructor(public readonly formItems: any) { }
}

export type Any = ShowHelpRequest | SubmitHelpRequest;
