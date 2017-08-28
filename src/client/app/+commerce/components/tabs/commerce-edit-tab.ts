import { OnInit, OnDestroy, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import {
  Project, AssetLineItem, Cart, QuoteType, QuoteOptions, Asset, PriceAttribute
} from '../../../shared/interfaces/commerce.interface';
import { UiConfig } from '../../../shared/services/ui.config';
import { MdSnackBar, MdDialogRef } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzSubclipEditorComponent } from '../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { AssetService } from '../../../store/services/asset.service';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { WzPricingComponent } from '../../../shared/components/wz-pricing/wz.pricing.component';
import { SelectedPriceAttributes, WzEvent, Pojo } from '../../../shared/interfaces/common.interface';
import { PricingStore } from '../../../shared/stores/pricing.store';
import { PricingService } from '../../../shared/services/pricing.service';
import { AppStore } from '../../../app.store';
import { EnhancedAsset, enhanceAsset } from '../../../shared/interfaces/enhanced-asset';
import * as SubclipMarkersInterface from '../../../shared/interfaces/subclip-markers';

export class CommerceEditTab extends Tab implements OnInit, OnDestroy {
  public cart: Observable<any>;
  public config: any;
  public priceAttributes: Array<PriceAttribute> = null;
  public pricingPreferences: Pojo;
  public quoteType: QuoteType = null;
  protected configSubscription: Subscription;
  protected preferencesSubscription: Subscription;
  protected usagePrice: Observable<number>;

  constructor(
    public userCan: CommerceCapabilities,
    protected commerceService: CartService | QuoteEditService,
    protected uiConfig: UiConfig,
    protected dialogService: WzDialogService,
    protected assetService: AssetService,
    protected window: WindowRef,
    protected userPreference: UserPreferenceService,
    protected document: any,
    protected snackBar: MdSnackBar,
    protected translate: TranslateService,
    protected pricingStore: PricingStore,
    protected store: AppStore,
    protected pricingService: PricingService) {
    super();
  }

  public ngOnInit(): void {
    this.preferencesSubscription = this.userPreference.data.subscribe((data: any) => {
      this.pricingPreferences = data.pricingPreferences;
    });
    this.configSubscription = this.uiConfig.get('cart').subscribe((config: any) => this.config = config.config);
  }

  public ngOnDestroy() {
    this.configSubscription.unsubscribe();
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
        this.commerceService.removeLineItem(message.payload);
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
    return (this.quoteType === 'ProvisionalOrder') || (this.rmAssetsHaveAttributes && !this.cartContainsNoAssets);
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

  public onSelectQuoteType(event: { type: QuoteType }): void {
    this.quoteType = event.type;
  }

  public showSnackBar(message: Pojo) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  protected editProjectPricing(project: Project) {
    let preferences: Pojo = project.attributes ? this.mapAttributesToPreferences(project.attributes) : this.pricingPreferences;
    if (this.priceAttributes) {
      this.openProjectPricingDialog(this.priceAttributes, preferences, project);
    } else {
      this.pricingService.getPriceAttributes().subscribe((priceAttributes: Array<PriceAttribute>) => {
        this.priceAttributes = priceAttributes;
        this.openProjectPricingDialog(priceAttributes, preferences, project);
      });
    }
  }

  protected showPricingDialog(lineItem: AssetLineItem): void {
    let preferences: Pojo = lineItem.attributes ? this.mapAttributesToPreferences(lineItem.attributes) : this.pricingPreferences;
    if (this.priceAttributes) {
      this.openPricingDialog(this.priceAttributes, preferences, lineItem);
    } else {
      this.pricingService.getPriceAttributes().subscribe((priceAttributes: Array<PriceAttribute>) => {
        this.priceAttributes = priceAttributes;
        this.openPricingDialog(priceAttributes, preferences, lineItem);
      });
    }
  }

  protected mapAttributesToPreferences(attributes: any): Pojo {
    if (Array.isArray(attributes)) {
      // if the attributes came from a lineItem, they are an Array of SelectedPriceAttributes
      // we need to map them to a Pojo to pass on to the pricing component
      let mapped: any = {};
      attributes.forEach((attr: SelectedPriceAttributes) => {
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

  protected openProjectPricingDialog(priceAttributes: Array<PriceAttribute>, preferences: Pojo, project: Project): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: WzPricingComponent,
        inputOptions: {
          attributes: priceAttributes,
          pricingPreferences: preferences,
          usagePrice: null
        },
        outputOptions: [
          {
            event: 'pricingEvent',
            callback: (event: WzEvent, dialogRef: any) => {
              this.applyProjectPricing(event, dialogRef, project);
            }
          }
        ]
      }
    );
  }

  protected applyProjectPricing(event: WzEvent, dialogRef: MdDialogRef<WzPricingComponent>, project: Project) {
    switch (event.type) {
      case 'APPLY_PRICE':
        this.commerceService.updateProjectPriceAttributes(event.payload.attributes, project);
        this.userPreference.updatePricingPreferences(event.payload.attributes);
        dialogRef.close();
        break;
      case 'ERROR':
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
      default:
        break;
    }
  }

  protected openPricingDialog(priceAttributes: Array<PriceAttribute>, preferences: Pojo, lineItem: AssetLineItem): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: WzPricingComponent,
        inputOptions: {
          attributes: priceAttributes,
          pricingPreferences: preferences,
          usagePrice: this.pricingStore.priceForDialog
        },
        outputOptions: [
          {
            event: 'pricingEvent',
            callback: (event: WzEvent, dialogRef: any) => {
              this.applyPricing(event, dialogRef, lineItem);
            }
          }
        ]
      }
    );
  }

  protected applyPricing(event: WzEvent, dialogRef: MdDialogRef<WzPricingComponent>, lineItem: AssetLineItem) {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.calculatePrice(event.payload, lineItem).subscribe((price: number) => {
          this.pricingStore.setPriceForDialog(price);
        });
        break;
      case 'APPLY_PRICE':
        this.commerceService.editLineItem(lineItem, { pricingAttributes: event.payload.attributes });
        this.userPreference.updatePricingPreferences(event.payload.attributes);
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
    this.assetService.getClipPreviewData(lineItem.asset.assetId)
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
        ).subscribe(_ => {
          this.document.body.classList.remove('subclipping-edit-open');
        });
      });
  }

  protected updateProject(project: Project) {
    this.dialogService.openFormDialog(
      project.items,
      {
        title: 'CART.PROJECTS.FORM.TITLE',
        submitLabel: 'CART.PROJECTS.FORM.SUBMIT_LABEL',
        autocomplete: 'off'
      },
      (data: any) => {
        this.commerceService.updateProject(Object.assign(project.project, data));
      }
    );
  }

  protected calculatePrice(attributes: Pojo, lineItem: AssetLineItem): Observable<number> {
    const markers: SubclipMarkersInterface.SubclipMarkers = (lineItem.asset as EnhancedAsset).isSubclipped ? {
      in: (lineItem.asset as EnhancedAsset).inMarkerFrame,
      out: (lineItem.asset as EnhancedAsset).outMarkerFrame
    } : null;
    return this.pricingService.getPriceFor((lineItem.asset as EnhancedAsset), attributes, markers);
  }
}
