import { Component, OnInit, OnDestroy, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/Rx';
import { Tab } from './tab';
import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { EditProjectComponent } from '../edit-project.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzAdvancedPlayerComponent } from
  '../../../../shared/modules/wz-player/components/wz-advanced-player/wz.advanced-player.component';
import { AssetService } from '../../../../shared/services/asset.service';
import { Capabilities } from '../../../../shared/services/capabilities.service';
import { WzPricingComponent } from '../../../../shared/components/wz-pricing/wz.pricing.component';
import { UserPreferenceService } from '../../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../../shared/stores/error.store';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html'
})

export class CartTabComponent extends Tab implements OnInit, OnDestroy {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public config: any;
  public priceAttributes: any = null;
  public pricingPreferences: any;
  private configSubscription: Subscription;
  private preferencesSubscription: Subscription;
  private usagePrice: any;

  constructor(
    public userCan: Capabilities,
    private cartService: CartService,
    private uiConfig: UiConfig,
    private dialog: MdDialog,
    private assetService: AssetService,
    private window: Window,
    private userPreference: UserPreferenceService,
    private error: ErrorStore,
    @Inject(DOCUMENT) private document: any) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.preferencesSubscription = this.userPreference.data.subscribe((data: any) => {
      this.pricingPreferences = data.pricingPreferences;
    });
    this.configSubscription = this.uiConfig.get('cart').subscribe((config: any) => this.config = config.config);
  }

  public ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.preferencesSubscription.unsubscribe();
  }

  public get assetsInCart(): Observable<boolean> {
    return this.cart.map(cart => (cart.itemCount || 0) > 0);
  }

  public onNotification(message: any): void {
    switch (message.type) {
      case 'ADD_PROJECT': {
        this.cartService.addProject();
        break;
      }
      case 'REMOVE_PROJECT': {
        this.cartService.removeProject(message.payload);
        break;
      }
      case 'UPDATE_PROJECT': {
        this.updateProject(message.payload);
        break;
      }
      case 'MOVE_LINE_ITEM': {
        this.cartService.moveLineItemTo(message.payload.otherProject, message.payload.lineItem);
        break;
      }
      case 'CLONE_LINE_ITEM': {
        this.cartService.cloneLineItem(message.payload);
        break;
      }
      case 'REMOVE_LINE_ITEM': {
        this.cartService.removeLineItem(message.payload);
        break;
      }
      case 'EDIT_LINE_ITEM': {
        this.cartService.editLineItem(message.payload.lineItem, message.payload.fieldToEdit);
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

  private showPricingDialog(lineItem: any): void {
    if (this.priceAttributes) {
      this.openPricingDialog(lineItem);
    } else {
      this.assetService.getPriceAttributes().subscribe((data: any) => {
        this.priceAttributes = data;
        this.openPricingDialog(lineItem);
      });
    }
  }

  private openPricingDialog(lineItem: any): void {
    let dialogRef: MdDialogRef<WzPricingComponent> = this.dialog.open(WzPricingComponent);
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.pricingPreferences = this.pricingPreferences;
    dialogRef.componentInstance.attributes = this.priceAttributes;
    dialogRef.componentInstance.pricingEvent.subscribe((event: any) => {
      this.handlePricingEvent(event, lineItem, dialogRef);
    });
  }

  private handlePricingEvent(event: any, lineItem: any, dialogRef: MdDialogRef<WzPricingComponent>): void {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        dialogRef.componentInstance.usagePrice = this.calculatePrice(lineItem.asset.assetId, event.payload);
        this.cartService.editLineItem(lineItem, { pricingAttributes: event.payload });
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

  private calculatePrice(assetId: number, attributes: any): Observable<number> {
    return this.assetService.getPrice(assetId, attributes).map((data: any) => { return data.price; });
  }

  private editAsset(payload: any) {
    this.assetService.getClipPreviewData(payload.asset.assetId).subscribe(data => {
      payload.asset.clipUrl = data.url;
      payload.asset.timeStart = payload.asset.startTime;
      payload.asset.timeEnd = payload.asset.endTime;
      let dialogRef: MdDialogRef<WzAdvancedPlayerComponent> = this.dialog.open(WzAdvancedPlayerComponent, { width: '544px' });
      Object.assign(dialogRef.componentInstance, { window: this.window, asset: payload.asset, displayContext: 'subClipEditDialog' });
      this.document.body.classList.add('subclipping-edit-open');
      dialogRef.componentInstance.dialog = dialogRef;
      dialogRef.componentInstance.onSubclip.subscribe((data: any) => {
        payload.asset.startTime = data.in;
        payload.asset.endTime = data.out;
        this.cartService.editLineItem(payload, {});
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.document.body.classList.remove('subclipping-edit-open');
      });
    });
  }

  private updateProject(project: any) {
    let dialogRef: MdDialogRef<any> = this.dialog.open(EditProjectComponent, { width: '600px' });
    Object.assign(dialogRef.componentInstance, { items: project.items, dialog: dialogRef });
    dialogRef.afterClosed()
      .filter(data => data)
      .map(data => Object.assign({}, project.project, data))
      .subscribe((data: any) => {
        this.cartService.updateProject(data);
      });
  }
}
