import { OnInit, OnDestroy, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import {
  Project, AssetLineItem, Cart, OrderableType, QuoteOptions, Asset, PriceAttribute
} from '../../../shared/interfaces/commerce.interface';
import { MatDialogRef } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { DefaultComponentOptions } from '../../../shared/modules/wz-dialog/interfaces/wz.dialog.interface';
import { WzSubclipEditorComponent } from '../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { WzPricingComponent } from '../../../shared/components/wz-pricing/wz.pricing.component';
import { SelectedPriceAttribute, WzEvent, Pojo } from '../../../shared/interfaces/common.interface';
import { AppStore } from '../../../app.store';
import { EnhancedAsset, enhanceAsset } from '../../../shared/interfaces/enhanced-asset';
import * as SubclipMarkersInterface from '../../../shared/interfaces/subclip-markers';

export class CommerceEditTab extends Tab implements OnInit, OnDestroy {
  public cart: Observable<any>;
  public config: any;
  public pricingPreferences: Pojo;
  public quoteType: OrderableType = null;
  protected preferencesSubscription: Subscription;
  protected usagePrice: Observable<number>;

  constructor(
    public userCan: CommerceCapabilities,
    protected commerceService: CartService,
    protected dialogService: WzDialogService,
    protected window: WindowRef,
    protected userPreference: UserPreferenceService,
    protected document: any,
    protected store: AppStore,
    protected detector: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.preferencesSubscription = this.userPreference.data.subscribe((data: any) => {
      this.pricingPreferences = data.pricingPreferences;
    });
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  public ngOnDestroy() {
    this.preferencesSubscription.unsubscribe();
  }

  public onNotification(message: WzEvent): void {
    switch (message.type) {
      case 'ADD_PROJECT': {
        this.commerceService.addProject();
        break;
      }
      case 'REMOVE_PROJECT': {
        this.commerceService.removeProject(message.payload);
        break;
      }
      case 'UPDATE_PROJECT': {
        this.updateProject(message.payload);
        break;
      }
      case 'MOVE_LINE_ITEM': {
        this.commerceService.moveLineItemTo(message.payload.otherProject, message.payload.lineItem);
        break;
      }
      case 'CLONE_LINE_ITEM': {
        this.commerceService.cloneLineItem(message.payload);
        break;
      }
      case 'REMOVE_LINE_ITEM': {
        this.store.dispatch(factory => message.payload.asset.type === 'quoteEditAsset'
          ? factory.quoteEdit.removeAsset(message.payload.asset)
          : factory.cart.removeAsset(message.payload.asset));
        break;
      }
      case 'EDIT_LINE_ITEM': {
        this.commerceService.editLineItem(message.payload.lineItem, message.payload.fieldToEdit);
        break;
      }
      case 'EDIT_LINE_ITEM_MARKERS': {
        this.editAsset(message.payload);
        break;
      }
      case 'SHOW_PRICING_DIALOG': {
        this.showPricingDialog(message.payload);
        break;
      }
      case 'EDIT_PROJECT_PRICING': {
        this.editProjectPricing(message.payload);
        break;
      }
    };
  }

  public get userCanProceed(): boolean {
    return (this.quoteType === 'Trial') || (this.rmAssetsHaveAttributes && !this.cartContainsNoAssets);
  }

  public get rmAssetsHaveAttributes(): boolean {
    if (this.commerceService.state.data.itemCount === 0) return true;

    let validAssets: boolean[] = [];

    this.commerceService.state.data.projects.forEach((project: Project) => {
      if (project.lineItems) {
        project.lineItems.forEach((lineItem: AssetLineItem) => {
          validAssets.push(lineItem.rightsManaged === 'Rights Managed' ? !!lineItem.attributes : true);
        });
      }
    });
    return validAssets.indexOf(false) === -1;
  }

  public get cartContainsNoAssets(): boolean {
    return (this.commerceService.state.data.itemCount === 0) ? true : false;
  }

  public get showUsageWarning(): boolean {
    return !this.cartContainsNoAssets && !this.userCanProceed;
  }

  protected editProjectPricing(project: Project) {
    let preferences: Pojo = project.attributes ? this.mapAttributesToPreferences(project.attributes) : this.pricingPreferences;
    this.store.dispatch(factory => factory.pricing.setPriceForDialog(null));
    this.store.dispatch(factory => factory.pricing.initializePricing(
      'Rights Managed',
      this.projectPricingOptions(preferences, project)
    ));
  }

  protected showPricingDialog(lineItem: AssetLineItem): void {
    let preferences: Pojo = lineItem.attributes ? this.mapAttributesToPreferences(lineItem.attributes) : this.pricingPreferences;
    this.store.dispatch(factory => factory.pricing.initializePricing(
      'Rights Managed',
      this.lineitemPricingOptions(preferences, lineItem)
    ));
  }

  protected mapAttributesToPreferences(attributes: any): Pojo {
    if (Array.isArray(attributes)) {
      // if the attributes came from a lineItem, they are an Array of SelectedPriceAttributes
      // we need to map them to a Pojo to pass on to the pricing component
      let mapped: any = {};
      attributes.forEach((attr: SelectedPriceAttribute) => {
        mapped[attr.priceAttributeName] = attr.selectedAttributeValue;
      });
      delete mapped['siteName'];
      return mapped;
    } else {
      // if the attributes came from a project, they are a Pojo.
      // we do not need to map them before passing them to the pricing component
      delete attributes['siteName'];
      return attributes;
    }
  }

  protected projectPricingOptions(preferences: Pojo, project: Project): DefaultComponentOptions {
    return {
      componentType: WzPricingComponent,
      inputOptions: {
        pricingPreferences: preferences,
        userCanCustomizeRights: this.userCan.administerQuotes()
      },
      outputOptions: [
        {
          event: 'pricingEvent',
          callback: (event: WzEvent, dialogRef: any) => {
            this.applyProjectPricing(event, dialogRef, project);
          }
        }
      ]
    };
  }

  protected applyProjectPricing(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>, project: Project) {
    switch (event.type) {
      case 'APPLY_PRICE':
        if (event.payload.updatePrefs) {
          this.userPreference.updatePricingPreferences(event.payload.preferences);
        }
        this.commerceService.updateProjectPriceAttributes(event.payload.attributes, project);
        dialogRef.close();
        break;
      case 'ERROR':
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
      default:
        break;
    }
  }

  protected lineitemPricingOptions(preferences: Pojo, lineItem: AssetLineItem): DefaultComponentOptions {
    return {
      componentType: WzPricingComponent,
      inputOptions: {
        pricingPreferences: preferences,
        userCanCustomizeRights: this.userCan.administerQuotes()
      },
      outputOptions: [
        {
          event: 'pricingEvent',
          callback: (event: WzEvent, dialogRef: any) => {
            this.applyPricing(event, dialogRef, lineItem);
          }
        }
      ]
    };
  }

  protected applyPricing(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>, lineItem: AssetLineItem) {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.store.dispatch(factory => factory.pricing.calculatePrice(
          event.payload,
          lineItem.asset.assetId,
          this.markersFrom(lineItem.asset as EnhancedAsset)
        ));
        break;
      case 'APPLY_PRICE':
        if (event.payload.updatePrefs) {
          this.userPreference.updatePricingPreferences(event.payload.preferences);
        }
        this.commerceService.editLineItem(lineItem, { pricingAttributes: event.payload.attributes });
        dialogRef.close();
        break;
      case 'ERROR':
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
      default:
        break;
    }
  }

  protected editAsset(lineItem: AssetLineItem) {
    this.store.callLegacyServiceMethod(service => service.asset.getClipPreviewData(lineItem.asset.assetId))
      .subscribe(data => {
        this.document.body.classList.add('subclipping-edit-open');
        lineItem.asset.clipUrl = data.url;
        this.dialogService.openComponentInDialog(
          {
            componentType: WzSubclipEditorComponent,
            dialogConfig: { width: '530px', position: { top: '14%' } },
            inputOptions: {
              window: this.window.nativeWindow,
              enhancedAsset: lineItem.asset,
              usagePrice: null
            },
            outputOptions: [
              {
                event: 'cancel',
                callback: (event: any) => { return true; },
                closeOnEvent: true
              },
              {
                event: 'save',
                callback: (newMarkers: SubclipMarkersInterface.SubclipMarkers) => {
                  this.commerceService.editLineItemMarkers(lineItem, newMarkers);
                },
                closeOnEvent: true
              }
            ]
          }
        ).subscribe(() => {
          this.document.body.classList.remove('subclipping-edit-open');
        });
      });
  }

  protected updateProject(project: Project) {
    this.dialogService.openFormDialog(
      project.items,
      {
        dialogConfig: { position: { top: '10%' }, disableClose: false },
        title: 'CART.PROJECTS.FORM.TITLE',
        submitLabel: 'CART.PROJECTS.FORM.SUBMIT_LABEL',
        autocomplete: 'off'
      },
      (data: any) => {
        this.commerceService.updateProject(Object.assign(project.project, data));
      }
    );
  }

  protected calculatePrice(attributes: Pojo, lineItem: AssetLineItem): void {
    const markers: SubclipMarkersInterface.SubclipMarkers = this.markersFrom(lineItem.asset as EnhancedAsset);
    this.store.dispatch(factory => factory.pricing.calculatePrice(attributes, lineItem.asset.assetId, markers));
  }

  protected markersFrom(asset: EnhancedAsset): SubclipMarkersInterface.SubclipMarkers {
    return asset.isSubclipped ? {
      in: asset.inMarkerFrame,
      out: asset.outMarkerFrame
    } : null;
  }
}
