import { Action } from '@ngrx/store';
import { Asset } from '../../shared/interfaces/common.interface';
import { SpeedviewData } from '../../shared/interfaces/asset.interface';

export class ActionFactory {
  public load(asset: Asset): Load {
    return new Load(asset);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(speedViewData: SpeedviewData): LoadSuccess {
    return new LoadSuccess(speedViewData);
  }
}

export class Load implements Action {
  public static readonly Type = '[SpeedPreview] Load';
  public readonly type = Load.Type;
  constructor(public readonly asset: Asset) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[SpeedPreview] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly speedViewData: SpeedviewData) { }
}

export type Any = Load | LoadSuccess;
