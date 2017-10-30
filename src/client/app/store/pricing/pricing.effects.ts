import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';

import { AppStore, ActionFactoryMapper } from '../../app.store';
import { PricingService } from './pricing.service';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { WzPricingComponent } from '../../shared/components/wz-pricing/wz.pricing.component';
import { WzEvent } from '../../shared/interfaces/common.interface';
import { enhanceAsset, EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import * as PricingActions from './pricing.actions';

@Injectable()
export class PricingEffects {
  @Effect()
  public getAttributes: Observable<Action> = this.actions.ofType(PricingActions.GetAttributes.Type)
    .switchMap((action: PricingActions.GetAttributes) => this.service.getPriceAttributes(action.rightsReproduction)
      .map(attributes => this.store.create(factory => factory.pricing.getAttributesSuccess(attributes)))
      .catch(error => Observable.of(this.store.create(factory => factory.pricing.getAttributesFailure(error))))
    );

  @Effect()
  public getAttributesSuccess: Observable<Action> = this.actions.ofType(PricingActions.GetAttributesSuccess.Type)
    .map(attributes => this.store.create(factory => factory.pricing.openPricingDialog()));

  @Effect()
  public calculatePrice: Observable<Action> = this.actions.ofType(PricingActions.CalculatePrice.Type)
    .withLatestFrom(this.store.select(state => enhanceAsset(state.asset.activeAsset, null)))
    .switchMap(([action, asset]: [PricingActions.CalculatePrice, EnhancedAsset]) =>
      this.service.getPriceFor(action.selectedAttributes, asset.assetId, { in: asset.inMarkerFrame, out: asset.outMarkerFrame })
        .map(price => this.store.create(factory => factory.pricing.calculatePriceSuccess(price)))
        .catch(error => Observable.of(this.store.create(factory => factory.pricing.calculatePriceFailure(error))))
    );

  @Effect()
  public calculatePriceSuccess: Observable<Action> = this.actions.ofType(PricingActions.CalculatePriceSuccess.Type)
    .map((action: PricingActions.CalculatePriceSuccess) =>
      this.store.create(factory => factory.pricing.setPriceForDialog(action.price))
    );

  @Effect({ dispatch: false })
  public openPricingDialog: Observable<Action> = this.actions.ofType(PricingActions.OpenPricingDialog.Type)
    .do((action: PricingActions.OpenPricingDialog) => {
      this.dialogService.openComponentInDialog(
        {
          componentType: WzPricingComponent,
          inputOptions: {
            pricingPreferences: this.userPreferenceService.state.pricingPreferences
          },
          outputOptions: [
            {
              event: 'pricingEvent',
              callback: (event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>) => {
                this.dispatchActionForPricingEvent(event, dialogRef);
              }
            }
          ]
        }
      );
    });


  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: PricingService,
    private dialogService: WzDialogService,
    private userPreferenceService: UserPreferenceService
  ) { }

  private dispatchActionForPricingEvent(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>): void {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.store.dispatch(factory => factory.pricing.calculatePriceFor(event.payload));
        break;
      case 'APPLY_PRICE':
        this.userPreferenceService.updatePricingPreferences(event.payload.attributes);
        dialogRef.close();
        this.store.dispatch(factory => factory.pricing.setPriceForDetails(event.payload.price));
        this.store.dispatch(factory => factory.pricing.setAppliedAttributes(event.payload.attributes));
        break;
      default:
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
    }
  }
}
