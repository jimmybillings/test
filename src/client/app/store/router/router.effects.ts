import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import * as RouterActions from './router.actions';
import * as UiConfigActions from '../ui-config/ui-config.actions';
import { bothMarkersAreSet, durationFrom } from '../../shared/interfaces/subclip-markers';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  public goToLogin: Observable<Action> = this.actions.ofType(RouterActions.GoToLogin.Type)
    .do((action: RouterActions.GoToLogin) => this.router.navigate([this.LoginPath]));

  @Effect({ dispatch: false })
  public goToLoginWithRedirect: Observable<Action> = this.actions.ofType(RouterActions.GoToLoginWithRedirect.Type)
    .do((action: RouterActions.GoToLoginWithRedirect) => {
      const currentPath: string = this.location.path().split(';')[0];
      if (currentPath !== this.LoginPath) {
        localStorage.setItem(this.RedirectUrlKey, currentPath);
        this.router.navigate([this.LoginPath, { requireLogin: true }]);
      }
    });

  @Effect({ dispatch: false })
  public goToPageNotFound: Observable<Action> = this.actions.ofType(RouterActions.GoToPageNotFound.Type)
    .do((action: RouterActions.GoToPageNotFound) => this.router.navigate([this.PageNotFoundPath]));

  @Effect({ dispatch: false })
  public goToSearchAssetDetails: Observable<Action> = this.actions.ofType(RouterActions.GoToSearchAssetDetails.Type)
    .do((action: RouterActions.GoToSearchAssetDetails) =>
      this.router.navigate([
        this.SearchAssetDetailsPath,
        action.assetId,
        bothMarkersAreSet(action.markers) ? durationFrom(action.markers) : {}
      ])
    );

  @Effect({ dispatch: false })
  public followRedirect: Observable<Action> = this.actions.ofType(RouterActions.FollowRedirect.Type)
    .do((action: RouterActions.FollowRedirect) => {
      const redirectUrl: string = localStorage.getItem(this.RedirectUrlKey);

      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
        localStorage.removeItem(this.RedirectUrlKey);
      } else {
        this.router.navigate([this.RootPath]);
      }
    });

  @Effect({ dispatch: false })
  public goToQuotes: Observable<Action> = this.actions.ofType(RouterActions.GoToQuotes.Type)
    .do(() => this.router.navigate([this.QuotesPath]));

  @Effect({ dispatch: false })
  public goToQuoteById: Observable<Action> = this.actions.ofType(RouterActions.GoToQuoteById.Type)
    .do((action: RouterActions.GoToQuoteById) => {
      return this.router.navigate([this.QuotesPath, action.quoteId]);
    });

  @Effect({ dispatch: false })
  public goToCollection: Observable<Action> = this.actions.ofType(RouterActions.GoToCollection.Type)
    .do((action: RouterActions.GoToCollection) => {
      this.router.navigate([this.CollectionsPath, action.collectionId, { i: action.page, n: action.perPage }]);
    });

  @Effect({ dispatch: false })
  public goToActiveQuote: Observable<Action> = this.actions.ofType(RouterActions.GoToActiveQuote.Type)
    .do((action: RouterActions.GoToActiveQuote) => this.router.navigate([this.ActiveQuotePath]));

  @Effect({ dispatch: false })
  public goToCart: Observable<Action> = this.actions.ofType(RouterActions.GoToCart.Type)
    .do((action: RouterActions.GoToCart) => this.router.navigate([this.CartPath]));

  @Effect({ dispatch: false })
  public initialNavigation: Observable<Action> = this.actions.ofType(UiConfigActions.LoadSuccess.Type)
    .do((action: UiConfigActions.LoadSuccess) => this.router.initialNavigation());

  private readonly LoginPath: string = '/user/login';
  private readonly PageNotFoundPath: string = '/404';
  private readonly QuotesPath: string = '/quotes';
  private readonly RootPath: string = '/';
  private readonly RedirectUrlKey: string = 'RouterEffects.RedirectUrl';
  private readonly SearchAssetDetailsPath: string = '/search/asset';
  private readonly CollectionsPath: string = '/collections';
  private readonly ActiveQuotePath: string = '/active-quote';
  private readonly CartPath: string = '/cart';

  constructor(private actions: Actions, private router: Router, private location: Location) { }
}

