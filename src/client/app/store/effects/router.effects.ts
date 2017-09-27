import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import * as RouterActions from '../actions/router.actions';
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
        `${this.SearchAssetDetailsPath}/${action.assetId}`,
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
  public goToCollection: Observable<Action> = this.actions.ofType(RouterActions.GoToCollection.Type)
    .do((action: RouterActions.GoToCollection) => {
      this.router.navigate([`${this.CollectionsPath}/${action.collectionId}`, { i: action.page, n: action.perPage }]);
    });

  @Effect({ dispatch: false })
  public goToQuote: Observable<Action> = this.actions.ofType(RouterActions.GoToQuote.Type)
    .do((action: RouterActions.GoToQuote) => {
      console.log(action);
      return this.router.navigate([`${this.QuotesPath}/${action.quoteId}`]);
    });


  private readonly LoginPath: string = '/user/login';
  private readonly PageNotFoundPath: string = '/404';
  private readonly QuotesPath: string = '/quotes';
  private readonly RootPath: string = '/';
  private readonly RedirectUrlKey: string = 'RouterEffects.RedirectUrl';
  private readonly SearchAssetDetailsPath: string = '/search/asset';
  private readonly CollectionsPath: string = '/collections';

  constructor(private actions: Actions, private router: Router, private location: Location) { }
}

