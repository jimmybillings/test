import { Action } from '@ngrx/store';

import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';

export class ActionFactory {
  public goToLogin(): GoToLogin {
    return new GoToLogin();
  }

  public goToLoginWithRedirect(): GoToLoginWithRedirect {
    return new GoToLoginWithRedirect();
  }

  public goToPageNotFound(): GoToPageNotFound {
    return new GoToPageNotFound();
  }

  public goToSearchAssetDetails(assetId: number, markers?: SubclipMarkers): GoToSearchAssetDetails {
    return new GoToSearchAssetDetails(assetId, markers);
  }

  public followRedirect(): FollowRedirect {
    return new FollowRedirect();
  }

  public goToQuotes(): GoToQuotes {
    return new GoToQuotes();
  }
}

export class InternalActionFactory extends ActionFactory { }

export class GoToLogin implements Action {
  public static readonly Type = '[Router] Go To Login';
  public readonly type = GoToLogin.Type;
}

export class GoToLoginWithRedirect implements Action {
  public static readonly Type = '[Router] Go To Login With Redirect';
  public readonly type = GoToLoginWithRedirect.Type;
}

export class FollowRedirect implements Action {
  public static readonly Type = '[Router] Follow Redirect';
  public readonly type = FollowRedirect.Type;
}

export class GoToPageNotFound implements Action {
  public static readonly Type = '[Router] Go To Page Not Found';
  public readonly type = GoToPageNotFound.Type;
}

export class GoToSearchAssetDetails implements Action {
  public static readonly Type = '[Router] Go To Search Asset Details';
  public readonly type = GoToSearchAssetDetails.Type;
  constructor(public readonly assetId: number, public readonly markers: SubclipMarkers) { }
}

export class GoToQuotes implements Action {
  public static readonly Type = '[Router] Go To Quotes';
  public readonly type = GoToQuotes.Type;
}
