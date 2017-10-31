import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';

import { AppStore, ActionFactoryMapper, PricingState } from '../../app.store';
import { PricingService } from './pricing.service';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzPricingComponent } from '../../shared/components/wz-pricing/wz.pricing.component';
import { WzEvent } from '../../shared/interfaces/common.interface';
import { enhanceAsset, EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import * as PricingActions from './pricing.actions';

@Injectable()
export class PricingEffects {
  @Effect()
  public initializePricing: Observable<Action> = this.actions.ofType(PricingActions.InitializePricing.Type)
    .withLatestFrom(this.store.select(state => state.pricing))
    .map(([action, state]: [PricingActions.InitializePricing, PricingState]) => {
      if (state.attributes === null) {
        return this.store.create(factory => factory.pricing.getAttributesAndOpenDialog(
          action.rightsReproduction,
          action.dialogOptions
        ));
      }

      return this.store.create(factory => factory.pricing.openDialog(action.dialogOptions));
    });

  @Effect()
  public getAttributes: Observable<Action> = this.actions.ofType(PricingActions.GetAttributesAndOpenDialog.Type)
    .switchMap((action: PricingActions.GetAttributesAndOpenDialog) => this.service.getPriceAttributes(action.rightsReproduction)
      .map(attributes => this.store.create(factory => factory.pricing.getAttributesSuccess(
        attributes,
        action.rightsReproduction,
        action.dialogOptions
      )))
      .catch(error => Observable.of(this.store.create(factory => factory.pricing.getAttributesFailure(error))))
    );

  @Effect()
  public getAttributesSuccess: Observable<Action> = this.actions.ofType(PricingActions.GetAttributesSuccess.Type)
    .map((action: PricingActions.GetAttributesSuccess) => this.store.create(factory =>
      factory.pricing.openDialog(action.dialogOptions))
    );

  @Effect()
  public calculatePrice: Observable<Action> = this.actions.ofType(PricingActions.CalculatePrice.Type)
    .switchMap((action: PricingActions.CalculatePrice) =>
      this.service.getPriceFor(action.selectedAttributes, action.assetId, action.subclipMarkers)
        .map(price => this.store.create(factory => factory.pricing.calculatePriceSuccess(price)))
        .catch(error => Observable.of(this.store.create(factory => factory.pricing.calculatePriceFailure(error))))
    );

  @Effect()
  public calculatePriceSuccess: Observable<Action> = this.actions.ofType(PricingActions.CalculatePriceSuccess.Type)
    .map((action: PricingActions.CalculatePriceSuccess) =>
      this.store.create(factory => factory.pricing.setPriceForDialog(action.price))
    );

  @Effect({ dispatch: false })
  public openDialog: Observable<Action> = this.actions.ofType(PricingActions.OpenDialog.Type)
    .do((action: PricingActions.OpenDialog) => this.dialogService.openComponentInDialog(action.dialogOptions));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: PricingService,
    private dialogService: WzDialogService
  ) { }
}
