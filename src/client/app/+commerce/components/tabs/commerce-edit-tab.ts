import { OnInit, OnDestroy, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import {
  Project, AssetLineItem, Cart, QuoteType, QuoteOptions, Asset,
  PriceAttributes
} from '../../../shared/interfaces/commerce.interface';
import { UiConfig } from '../../../shared/services/ui.config';
import { MdSnackBar, MdDialogRef } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzSubclipEditorComponent } from '../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { AssetService } from '../../../shared/services/asset.service';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../shared/stores/error.store';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { SubclipMarkers } from '../../../shared/interfaces/asset.interface';
import { TranslateService } from '@ngx-translate/core';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { WzPricingComponent } from '../../../shared/components/wz-pricing/wz.pricing.component';
import { SelectedPriceAttributes, WzEvent, Poj } from '../../../shared/interfaces/common.interface';

export class CommerceEditTab extends Tab implements OnInit, OnDestroy {

  public cart: Observable<any>;
  public config: any;
  public priceAttributes: PriceAttributes = null;
  public pricingPreferences: Poj;
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
    protected error: ErrorStore,
    protected document: any,
    protected snackBar: MdSnackBar,
    protected translate: TranslateService) {
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
    return (this.quoteType === 'ProvisionalOrder') || this.rmAssetsHaveAttributes;
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

  public onSelectQuoteType(event: { type: QuoteType }): void {
    this.quoteType = event.type;
  }

  protected editProjectPricing(project: Project) {
    this.assetService.getPriceAttributes().subscribe((priceAttributes: PriceAttributes) => {
      this.openProjectPricingDialog(priceAttributes, project);
    });
  }

  protected showPricingDialog(lineItem: AssetLineItem): void {
    if (this.priceAttributes) {
      this.openPricingDialog(lineItem);
    } else {
      this.assetService.getPriceAttributes().subscribe((priceAttributes: PriceAttributes) => {
        this.priceAttributes = priceAttributes;
        this.openPricingDialog(lineItem);
      });
    }
  }

  protected openProjectPricingDialog(priceAttributes: PriceAttributes, project: Project): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: WzPricingComponent,
        inputOptions: {
          attributes: priceAttributes,
          pricingPreferences: this.pricingPreferences,
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
      case 'UPDATE_PREFERENCES':
        this.commerceService.updateProjectPriceAttributes(event.payload, project);
        this.userPreference.updatePricingPreferences(event.payload);
        dialogRef.close();
        break;
      case 'ERROR':
        this.error.dispatch({ status: event.payload });
        break;
      default:
        break;
    }
  }

  protected openPricingDialog(lineItem: AssetLineItem): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: WzPricingComponent,
        inputOptions: {
          attributes: this.priceAttributes,
          pricingPreferences: this.pricingPreferences,
          usagePrice: null
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
        this.assetService.getPrice(lineItem.asset.assetId, event.payload)
          .map(data => data.price)
          .subscribe(data => dialogRef.componentInstance.usagePrice = Observable.of(data));
        this.commerceService.editLineItem(lineItem, { pricingAttributes: event.payload });
        break;
      case 'UPDATE_PREFERENCES':
        this.userPreference.updatePricingPreferences(event.payload);
        dialogRef.close();
        break;
      case 'ERROR':
        this.error.dispatch({ status: event.payload });
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
            inputOptions: {
              window: this.window.nativeWindow,
              asset: lineItem.asset,
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
                callback: (event: any) => {
                  Object.assign(lineItem.asset,
                    { timeStart: event.in, timeEnd: event.out });
                  this.commerceService.editLineItem(lineItem, {});
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

  protected showSnackBar(message: Poj) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }
}
