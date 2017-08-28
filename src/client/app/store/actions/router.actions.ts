import { Action } from '@ngrx/store';

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

  public followRedirect(): FollowRedirect {
    return new FollowRedirect();
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
