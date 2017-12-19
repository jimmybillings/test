import { Action } from '@ngrx/store';

export class ActionFactory {
  public loadFooter(): LoadFooter {
    return new LoadFooter();
  }

  public loadHomeAssets(): LoadHomeAssets {
    return new LoadHomeAssets();
  }
}
export class InternalActionFactory extends ActionFactory {
  public loadFooterSuccess(footer: any): LoadFooterSuccess {
    return new LoadFooterSuccess(footer);
  }

  public loadHomeAssetsSuccess(homeAssets: any): LoadHomeAssetsSuccess {
    return new LoadHomeAssetsSuccess(homeAssets);
  }
}

export class LoadFooter implements Action {
  public static readonly Type = '[Cms] Load Footer';
  public readonly type = LoadFooter.Type;
}

export class LoadHomeAssets implements Action {
  public static readonly Type = '[Cms] Load Home Assets';
  public readonly type = LoadHomeAssets.Type;
}

export class LoadFooterSuccess implements Action {
  public static readonly Type = '[Cms] Load Footer Success';
  public readonly type = LoadFooterSuccess.Type;
  constructor(public readonly footer: any) { }
}

export class LoadHomeAssetsSuccess implements Action {
  public static readonly Type = '[Cms] Load Home Assets Success';
  public readonly type = LoadHomeAssetsSuccess.Type;
  constructor(public readonly homeAssets: any) { }
}

export type Any = LoadFooter | LoadFooterSuccess | LoadHomeAssets | LoadHomeAssetsSuccess;
