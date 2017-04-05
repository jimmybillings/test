import { OnInit, OnDestroy, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/Rx';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import { Project, LineItem, Cart } from '../../../shared/interfaces/cart.interface';
import { UiConfig } from '../../../shared/services/ui.config';
import { ProjectEditComponent } from '../project/project-edit.component';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { WzSubclipEditorComponent } from '../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { AssetService } from '../../../shared/services/asset.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { WzPricingComponent } from '../../../shared/components/wz-pricing/wz.pricing.component';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../shared/stores/error.store';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { SubclipMarkers } from '../../../shared/interfaces/asset.interface';
import { QuoteFormComponent } from '../../+quote/components/quote-form.component';
import { PurchaseType, QuoteOptions } from '../../../shared/interfaces/quote.interface';
import { TranslateService } from '@ngx-translate/core';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';

export class CommerceEditTab extends Tab implements OnInit, OnDestroy {

  public cart: Observable<any>;
  public config: any;
  public priceAttributes: any = null;
  public pricingPreferences: any;
  public quoteType: PurchaseType = null;
  protected configSubscription: Subscription;
  protected preferencesSubscription: Subscription;
  protected usagePrice: any;
  protected suggestions: any[];

  constructor(
    public userCan: Capabilities,
    protected commerceService: CartService | QuoteEditService,
    protected uiConfig: UiConfig,
    protected dialog: MdDialog,
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

  public get userCanProceed(): boolean {
    if (this.quoteType === 'ProvisionalOrder') {
      return true;
    } else {
      return this.rmAssetsHaveAttributes;
    }
  }

  public get rmAssetsHaveAttributes(): boolean {
    if (this.commerceService.state.cart.itemCount === 0) return true;

    let validAssets: boolean[] = [];

    this.commerceService.state.cart.projects.forEach((project: Project) => {
      if (project.lineItems) {
        project.lineItems.forEach((lineItem: LineItem) => {
          validAssets.push(lineItem.rightsManaged === 'Rights Managed' ? !!lineItem.attributes : true);
        });
      }
    });

    return validAssets.indexOf(false) === -1;
  }

  public onSelectQuoteType(event: { type: PurchaseType }): void {
    this.quoteType = event.type;
  }

  public onNotification(message: any): void {
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
    };
  }

  protected showPricingDialog(lineItem: any): void {
    if (this.priceAttributes) {
      this.openPricingDialog(lineItem);
    } else {
      this.assetService.getPriceAttributes().subscribe((data: any) => {
        this.priceAttributes = data;
        this.openPricingDialog(lineItem);
      });
    }
  }

  protected openPricingDialog(lineItem: any): void {
    let dialogRef: MdDialogRef<WzPricingComponent> = this.dialog.open(WzPricingComponent);
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.pricingPreferences = this.pricingPreferences;
    dialogRef.componentInstance.attributes = this.priceAttributes;
    dialogRef.componentInstance.pricingEvent.subscribe((event: any) => {
      this.handlePricingEvent(event, lineItem, dialogRef);
    });
  }

  protected handlePricingEvent(event: any, lineItem: any, dialogRef: MdDialogRef<WzPricingComponent>): void {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        dialogRef.componentInstance.usagePrice = this.calculatePrice(lineItem.asset.assetId, event.payload);
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

  protected calculatePrice(assetId: number, attributes: any): Observable<number> {
    return this.assetService.getPrice(assetId, attributes).map((data: any) => { return data.price; });
  }

  protected editAsset(payload: any) {
    this.assetService.getClipPreviewData(payload.asset.assetId).subscribe(data => {
      payload.asset.clipUrl = data.url;
      let dialogRef: MdDialogRef<WzSubclipEditorComponent> = this.dialog.open(WzSubclipEditorComponent, { width: '544px' });
      // workaround for cart assets that have asset.timeStart = -1, and asset.timeStart = -2
      if (payload.asset.timeStart < 0) payload.asset.timeStart = undefined;
      if (payload.asset.timeEnd < 0) payload.asset.timeEnd = undefined;
      Object.assign(dialogRef.componentInstance, { window: this.window.nativeWindow, asset: payload.asset });
      this.document.body.classList.add('subclipping-edit-open');
      dialogRef.componentInstance.cancel.subscribe(() => dialogRef.close());
      dialogRef.componentInstance.save.subscribe((newMarkers: SubclipMarkers) => {
        payload.asset.timeStart = newMarkers.in;
        payload.asset.timeEnd = newMarkers.out;
        this.commerceService.editLineItem(payload, {});
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.document.body.classList.remove('subclipping-edit-open');
      });
    });
  }

  protected updateProject(project: any) {
    let dialogRef: MdDialogRef<any> = this.dialog.open(ProjectEditComponent, { position: { top: '14%' } });
    Object.assign(dialogRef.componentInstance, { items: project.items, dialog: dialogRef });
    dialogRef.afterClosed()
      .filter(data => data)
      .map(data => Object.assign({}, project.project, data))
      .subscribe((data: any) => {
        this.commerceService.updateProject(data);
      });
  }

  protected showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

}
