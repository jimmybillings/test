import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';

import * as ActiveCollectionActions from './store/active-collection/active-collection.actions';
import * as ActiveCollectionState from './store/active-collection/active-collection.state';
export type ActiveCollectionState = ActiveCollectionState.State;

import * as ActiveCollectionAssetActions from './store/active-collection-asset/active-collection-asset.actions';
import * as ActiveCollectionAssetState from './store/active-collection-asset/active-collection-asset.state';
export type ActiveCollectionAssetState = ActiveCollectionAssetState.State;

import * as CartActions from './store/cart/cart.actions';
import * as CartState from './store/cart/cart.state';
export type CartState = CartState.State;

import * as CartAssetActions from './store/cart-asset/cart-asset.actions';
import * as CartAssetState from './store/cart-asset/cart-asset.state';
export type CartAssetState = CartAssetState.State;

import * as CommentActions from './store/comment/comment.actions';
import * as CommentState from './store/comment/comment.state';
export type CommentState = CommentState.State;

import * as DialogActions from './store/dialog/dialog.actions';

import * as ErrorActions from './store/error/error.actions';

import * as HeaderDisplayOptionsActions from './store/header-display-options/header-display-options.actions';
import * as HeaderDisplayOptionsState from './store/header-display-options/header-display-options.state';
export type HeaderDisplayOptionsState = HeaderDisplayOptionsState.State;

import * as NotifierActions from './store/notifier/notifier.actions';

import * as LoadingIndicatorActions from './store/loading-indicator/loading-indicator.actions';
import * as LoadingIndicatorState from './store/loading-indicator/loading-indicator.state';
export type LoadingIndicatorState = LoadingIndicatorState.State;

import * as OrderActions from './store/order/order.actions';
import * as OrderState from './store/order/order.state';
export type OrderState = OrderState.State;

import * as OrderAssetActions from './store/order-asset/order-asset.actions';
import * as OrderAssetState from './store/order-asset/order-asset.state';
export type OrderAssetState = OrderAssetState.State;

import * as QuoteEditAssetActions from './store/quote-edit-asset/quote-edit-asset.actions';
import * as QuoteEditAssetState from './store/quote-edit-asset/quote-edit-asset.state';
export type QuoteEditAssetState = QuoteEditAssetState.State;

import * as QuoteEditActions from './store/quote-edit/quote-edit.actions';
import * as QuoteEditState from './store/quote-edit/quote-edit.state';
export type QuoteEditState = QuoteEditState.State;

import * as QuoteShowAssetActions from './store/quote-show-asset/quote-show-asset.actions';
import * as QuoteShowAssetState from './store/quote-show-asset/quote-show-asset.state';
export type QuoteShowAssetState = QuoteShowAssetState.State;

import * as QuoteShowActions from './store/quote-show/quote-show.actions';
import * as QuoteShowState from './store/quote-show/quote-show.state';
export type QuoteShowState = QuoteShowState.State;

import * as RouterActions from './store/router/router.actions';

import * as SearchAssetActions from './store/search-asset/search-asset.actions';
import * as SearchAssetState from './store/search-asset/search-asset.state';
export type SearchAssetState = SearchAssetState.State;

import * as SnackbarActions from './store/snackbar/snackbar.actions';
import * as SnackbarState from './store/snackbar/snackbar.state';
export type SnackbarState = SnackbarState.State;

import * as SpeedPreviewActions from './store/speed-preview/speed-preview.actions';
import * as SpeedPreviewState from './store/speed-preview/speed-preview.state';
export type SpeedPreviewState = SpeedPreviewState.State;

import * as UiConfigActions from './store/ui-config/ui-config.actions';
import * as UiConfigState from './store/ui-config/ui-config.state';
export type UiConfigState = UiConfigState.State;

export interface ActionFactory {
  readonly activeCollection: ActiveCollectionActions.ActionFactory;
  readonly activeCollectionAsset: ActiveCollectionAssetActions.ActionFactory;
  readonly cart: CartActions.ActionFactory;
  readonly cartAsset: CartAssetActions.ActionFactory;
  readonly comment: CommentActions.ActionFactory;
  readonly dialog: DialogActions.ActionFactory;
  readonly error: ErrorActions.ActionFactory;
  readonly headerDisplayOptions: HeaderDisplayOptionsActions.ActionFactory;
  readonly loadingIndicator: LoadingIndicatorActions.ActionFactory;
  readonly order: OrderActions.ActionFactory;
  readonly orderAsset: OrderAssetActions.ActionFactory;
  readonly quoteEdit: QuoteEditActions.ActionFactory;
  readonly quoteEditAsset: QuoteEditAssetActions.ActionFactory;
  readonly quoteShow: QuoteShowActions.ActionFactory;
  readonly quoteShowAsset: QuoteShowAssetActions.ActionFactory;
  readonly router: RouterActions.ActionFactory;
  readonly notifier: NotifierActions.ActionFactory;
  readonly searchAsset: SearchAssetActions.ActionFactory;
  readonly snackbar: SnackbarActions.ActionFactory;
  readonly speedPreview: SpeedPreviewActions.ActionFactory;
  readonly uiConfig: UiConfigActions.ActionFactory;
};

export interface InternalActionFactory {
  readonly activeCollection: ActiveCollectionActions.InternalActionFactory;
  readonly activeCollectionAsset: ActiveCollectionAssetActions.InternalActionFactory;
  readonly cart: CartActions.InternalActionFactory;
  readonly cartAsset: CartAssetActions.InternalActionFactory;
  readonly comment: CommentActions.InternalActionFactory;
  readonly dialog: DialogActions.InternalActionFactory;
  readonly error: ErrorActions.InternalActionFactory;
  readonly headerDisplayOptions: HeaderDisplayOptionsActions.InternalActionFactory;
  readonly loadingIndicator: LoadingIndicatorActions.InternalActionFactory;
  readonly notifier: NotifierActions.InternalActionFactory;
  readonly order: OrderActions.InternalActionFactory;
  readonly orderAsset: OrderAssetActions.InternalActionFactory;
  readonly quoteEdit: QuoteEditActions.InternalActionFactory;
  readonly quoteEditAsset: QuoteEditAssetActions.InternalActionFactory;
  readonly quoteShow: QuoteShowActions.InternalActionFactory;
  readonly quoteShowAsset: QuoteShowAssetActions.InternalActionFactory;
  readonly router: RouterActions.InternalActionFactory;
  readonly searchAsset: SearchAssetActions.InternalActionFactory;
  readonly snackbar: SnackbarActions.InternalActionFactory;
  readonly speedPreview: SpeedPreviewActions.InternalActionFactory;
  readonly uiConfig: UiConfigActions.InternalActionFactory;
};

export interface AppState {
  readonly activeCollection: ActiveCollectionState;
  readonly activeCollectionAsset: ActiveCollectionAssetState;
  readonly cart: CartState;
  readonly cartAsset: CartAssetState;
  readonly comment: CommentState;
  readonly headerDisplayOptions: HeaderDisplayOptionsState;
  readonly loadingIndicator: LoadingIndicatorState;
  readonly order: OrderState;
  readonly orderAsset: OrderAssetState;
  readonly quoteEdit: QuoteEditState;
  readonly quoteEditAsset: QuoteEditAssetState;
  readonly quoteShow: QuoteShowState;
  readonly quoteShowAsset: QuoteShowAssetState;
  readonly snackbar: SnackbarState;
  readonly searchAsset: SearchAssetState;
  readonly speedPreview: SpeedPreviewState;
  readonly uiConfig: UiConfigState;
}

export interface AppReducers {
  readonly [reducerName: string]: Function;
};

// NOTE:  Until all the old legacy reducers are replaced, you must ALSO redefine these directly in shared.module.ts.
export const reducers: AppReducers = {
  activeCollection: ActiveCollectionState.reducer,
  asset: SearchAssetState.reducer,
  cart: CartState.reducer,
  comment: CommentState.reducer,
  headerDisplayOptions: HeaderDisplayOptionsState.reducer,
  loadingIndicator: LoadingIndicatorState.reducer,
  order: OrderState.reducer,
  orderState: OrderAssetState.reducer,
  quoteEdit: QuoteEditState.reducer,
  quoteEditAsset: QuoteEditAssetState.reducer,
  quoteShow: QuoteShowState.reducer,
  quoteShowAsset: QuoteShowAssetState.reducer,
  snackbar: SnackbarState.reducer,
  speedPreview: SpeedPreviewState.reducer,
  uiConfig: UiConfigState.reducer
};

export type ActionFactoryMapper = (factory: ActionFactory) => Action;
export type InternalActionFactoryMapper = (factory: InternalActionFactory) => Action;
export type StateMapper<T> = (state: AppState) => T;

@Injectable()
export class AppStore {
  private readonly actionFactory: ActionFactory = {
    activeCollection: new ActiveCollectionActions.ActionFactory(),
    activeCollectionAsset: new ActiveCollectionAssetActions.ActionFactory(),
    cart: new CartActions.ActionFactory(),
    cartAsset: new CartAssetActions.ActionFactory(),
    comment: new CommentActions.ActionFactory(),
    dialog: new DialogActions.ActionFactory(),
    error: new ErrorActions.ActionFactory(),
    headerDisplayOptions: new HeaderDisplayOptionsActions.ActionFactory(),
    loadingIndicator: new LoadingIndicatorActions.ActionFactory(),
    notifier: new NotifierActions.ActionFactory(),
    order: new OrderActions.ActionFactory(),
    orderAsset: new OrderAssetActions.ActionFactory(),
    quoteEdit: new QuoteEditActions.ActionFactory(),
    quoteEditAsset: new QuoteEditAssetActions.ActionFactory(),
    quoteShow: new QuoteShowActions.ActionFactory(),
    quoteShowAsset: new QuoteShowAssetActions.ActionFactory(),
    router: new RouterActions.ActionFactory(),
    searchAsset: new SearchAssetActions.ActionFactory(),
    snackbar: new SnackbarActions.ActionFactory(),
    speedPreview: new SpeedPreviewActions.ActionFactory(),
    uiConfig: new UiConfigActions.ActionFactory()
  };

  private readonly internalActionFactory: InternalActionFactory = {
    activeCollection: new ActiveCollectionActions.InternalActionFactory(),
    activeCollectionAsset: new ActiveCollectionAssetActions.InternalActionFactory(),
    cart: new CartActions.InternalActionFactory(),
    cartAsset: new CartAssetActions.InternalActionFactory(),
    comment: new CommentActions.InternalActionFactory(),
    dialog: new DialogActions.InternalActionFactory(),
    error: new ErrorActions.InternalActionFactory(),
    headerDisplayOptions: new HeaderDisplayOptionsActions.InternalActionFactory(),
    loadingIndicator: new LoadingIndicatorActions.InternalActionFactory(),
    notifier: new NotifierActions.InternalActionFactory(),
    order: new OrderActions.InternalActionFactory(),
    orderAsset: new OrderAssetActions.InternalActionFactory(),
    quoteEdit: new QuoteEditActions.InternalActionFactory(),
    quoteEditAsset: new QuoteEditAssetActions.InternalActionFactory(),
    quoteShow: new QuoteShowActions.InternalActionFactory(),
    quoteShowAsset: new QuoteShowAssetActions.InternalActionFactory(),
    router: new RouterActions.InternalActionFactory(),
    searchAsset: new SearchAssetActions.InternalActionFactory(),
    snackbar: new SnackbarActions.InternalActionFactory(),
    speedPreview: new SpeedPreviewActions.InternalActionFactory(),
    uiConfig: new UiConfigActions.InternalActionFactory()
  };

  constructor(private ngrxStore: Store<AppState>) { }

  public dispatch(actionFactoryMapper: ActionFactoryMapper): void {
    this.ngrxStore.dispatch(actionFactoryMapper(this.actionFactory));
  }

  public create(internalActionFactoryMapper: InternalActionFactoryMapper): Action {
    return internalActionFactoryMapper(this.internalActionFactory);
  }

  public select<T>(stateMapper: StateMapper<T>): Observable<T> {
    return this.ngrxStore.select(stateMapper);
  }

  public snapshot<T>(stateMapper: StateMapper<T>): T {
    let snapshot: T;
    this.select(stateMapper).take(1).subscribe((latest: T) => snapshot = latest);
    return snapshot;
  }

  public completeSnapshot(): AppState {
    return this.snapshot(state => state);
  }

  public match<T>(value: T, stateMapper: StateMapper<T>): boolean {
    return value === this.snapshot(stateMapper);
  }

  public blockUntil(stateMapper: StateMapper<boolean>): Observable<boolean> {
    return this.select(stateMapper).filter((selectedValue: boolean) => selectedValue).take(1);
  }

  public blockUntilMatch<T>(value: T, stateMapper: StateMapper<T>): Observable<null> {
    return this.select(stateMapper).filter((selectedValue: T) => value === selectedValue).take(1).map((value: T) => null);
  }
}
