import { Action } from '@ngrx/store';

export class ActionFactory {
  public loadFooter(): LoadFooter {
    return new LoadFooter();
  }

  public loadHomeAssets(): LoadHomeAssets {
    return new LoadHomeAssets();
  }

  public loadNavBar(): LoadNavBar {
    return new LoadNavBar();
  }
}
export class InternalActionFactory extends ActionFactory {
  public loadFooterSuccess(footer: any): LoadFooterSuccess {
    return new LoadFooterSuccess(footer);
  }

  public loadHomeAssetsSuccess(homeAssets: any): LoadHomeAssetsSuccess {
    return new LoadHomeAssetsSuccess(homeAssets);
  }

  public loadNavBarSuccess(navBar: any): LoadNavBarSuccess {
    return new LoadNavBarSuccess(navBar);
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

export class LoadNavBar implements Action {
  public static readonly Type = '[Cms] Load Nav Bar';
  public readonly type = LoadNavBar.Type;
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

export class LoadNavBarSuccess implements Action {
  public static readonly Type = '[Cms] Load Nav Bar Success';
  public readonly type = LoadNavBarSuccess.Type;
  constructor(public readonly navBar: any) { }
}

export type Any = LoadFooter | LoadFooterSuccess | LoadHomeAssets |
  LoadHomeAssetsSuccess | LoadNavBar | LoadNavBarSuccess;
