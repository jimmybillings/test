import { Component, OnInit, OnDestroy, Output, EventEmitter, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/Rx';
import { Tab } from './tab';
import { CartService } from '../../../../shared/services/cart.service';
import { Project, LineItem, Cart } from '../../../../shared/interfaces/cart.interface';
import { UiConfig } from '../../../../shared/services/ui.config';
import { ProjectEditComponent } from '../project/project-edit.component';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { WzSubclipEditorComponent } from '../../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { AssetService } from '../../../../shared/services/asset.service';
import { Capabilities } from '../../../../shared/services/capabilities.service';
import { WzPricingComponent } from '../../../../shared/components/wz-pricing/wz.pricing.component';
import { UserPreferenceService } from '../../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../../shared/stores/error.store';
import { WindowRef } from '../../../../shared/services/window-ref.service';
import { SubclipMarkers } from '../../../../shared/interfaces/asset.interface';
import { QuoteService } from '../../../../shared/services/quote.service';
import { QuoteFormComponent } from '../quote-form.component';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartTabComponent extends Tab implements OnInit, OnDestroy {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public config: any;
  public priceAttributes: any = null;
  public pricingPreferences: any;
  public quoteType: 'standard' | 'provisionalOrder' | 'offlineAgreement' = null;
  private configSubscription: Subscription;
  private preferencesSubscription: Subscription;
  private usagePrice: any;
  private suggestions: any[];

  constructor(
    public userCan: Capabilities,
    private cartService: CartService,
    private uiConfig: UiConfig,
    private dialog: MdDialog,
    private assetService: AssetService,
    private window: WindowRef,
    private userPreference: UserPreferenceService,
    private error: ErrorStore,
    private quoteService: QuoteService,
    @Inject(DOCUMENT) private document: any,
    private snackBar: MdSnackBar,
    private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data.map((data: any) => data.cart);
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

  public onOpenQuoteDialog(): void {
    let dialogRef: MdDialogRef<QuoteFormComponent> = this.dialog.open(QuoteFormComponent, {
      height: '400px', position: { top: '10%' }
    });
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.items = this.config.createQuote.items;
    dialogRef.afterClosed().subscribe((form: { emailAddress: string, expirationDate: string }) => {
      if (form) {
        this.createQuote({
          status: 'ACTIVE',
          emailAddress: form.emailAddress,
          expirationDate: form.expirationDate,
          users: this.suggestions
        });
      }
    });
    dialogRef.componentInstance.cacheSuggestions.subscribe((suggestions: any[]) => {
      this.suggestions = suggestions;
    });
  }

  public onSaveAsDraft(): void {
    this.createQuote({ saveAsDraft: 'PENDING' });
  }

  public get rmAssetsHaveAttributes(): boolean {
    if (this.cartService.state.cart.itemCount === 0) return true;

    let validAssets: boolean[] = [];

    this.cartService.state.cart.projects.forEach((project: Project) => {
      if (project.lineItems) {
        project.lineItems.forEach((lineItem: LineItem) => {
          validAssets.push(lineItem.rightsManaged === 'Rights Managed' ? !!lineItem.attributes : true);
        });
      }
    });

    return validAssets.indexOf(false) === -1;
  }

  public onSelectQuoteType(event: any): void {
    this.quoteType = event.type;
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
        this.cartService.editLineItem(payload, {});
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.document.body.classList.remove('subclipping-edit-open');
      });
    });
  }

  private updateProject(project: any) {
    let dialogRef: MdDialogRef<any> = this.dialog.open(ProjectEditComponent, { position: { top: '14%' } });
    Object.assign(dialogRef.componentInstance, { items: project.items, dialog: dialogRef });
    dialogRef.afterClosed()
      .filter(data => data)
      .map(data => Object.assign({}, project.project, data))
      .subscribe((data: any) => {
        this.cartService.updateProject(data);
      });
  }

  private createQuote(options: any): void {
    Object.assign(options, { quoteType: this.quoteType });
    this.quoteService.createQuote(options).take(1).subscribe((res: any) => {
      if (options.status === 'ACTIVE') {
        this.showSnackBar({
          key: 'QUOTE.CREATED_FOR_TOAST',
          value: { emailAddress: options.emailAddress }
        });
      } else {
        this.showSnackBar({
          key: 'QUOTE.SAVED_AS_DRAFT_TOAST',
        });
      }
    }, (err) => {
      console.error(err);
    });
  }

  private showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

}
