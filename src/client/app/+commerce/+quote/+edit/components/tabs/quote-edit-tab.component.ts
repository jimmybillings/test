import { Common } from '../../../../../shared/utilities/common.functions';
import { enhanceAsset, EnhancedAsset } from '../../../../../shared/interfaces/enhanced-asset';
import { WzPricingComponent } from '../../../../../shared/components/wz-pricing/wz.pricing.component';
import { WzSubclipEditorComponent } from '../../../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { Tab } from '../../../../components/tabs/tab';
import { Component, Inject, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { WzDialogService } from '../../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Capabilities } from '../../../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../../../shared/services/user-preference.service';
import { WindowRef } from '../../../../../shared/services/window-ref.service';
import { AssetLineItem, OrderableType, PriceAttribute, Project } from '../../../../../shared/interfaces/commerce.interface';
import { Pojo, SelectedPriceAttributes, WzEvent } from '../../../../../shared/interfaces/common.interface';
import { FormFields, MdSelectOption } from '../../../../../shared/interfaces/forms.interface';
import { PricingStore } from '../../../../../shared/stores/pricing.store';
import { AppStore } from '../../../../../app.store';
import { PricingService } from '../../../../../shared/services/pricing.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as SubclipMarkersInterface from '../../../../../shared/interfaces/subclip-markers';
import { MatDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-tab-component',
  templateUrl: 'quote-edit-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditTabComponent extends Tab implements OnInit, OnDestroy {
  public projects: Project[];
  public config: Pojo;
  public quoteType: OrderableType = null;
  public pricingPreferences: Pojo;
  public priceAttributes: Array<PriceAttribute> = null;
  private projectSubscription: Subscription;
  private preferencesSubscription: Subscription;

  constructor(
    public userCan: Capabilities,
    public dialogService: WzDialogService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    @Inject(DOCUMENT) public document: any,
    public pricingStore: PricingStore,
    protected store: AppStore,
    public pricingService: PricingService
  ) {
    super();
    this.projectSubscription = this.store.select(state => state.quoteEdit.data.projects)
      .subscribe(projects => this.projects = this.enhanceAssetsInProjects(projects));
  }

  public ngOnInit(): void {

    this.preferencesSubscription = this.userPreference.data.subscribe((data: any) => {
      this.pricingPreferences = data.pricingPreferences;
    });
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  public enhanceAssetsInProjects(projects: Project[]): Project[] {
    const clonedProjects: Project[] = Common.clone(projects);

    return clonedProjects.map((project: Project) => {
      if (project.lineItems) {
        project.lineItems = project.lineItems.map((lineItem: AssetLineItem) => {
          lineItem.asset = enhanceAsset(Object.assign(lineItem.asset, { uuid: lineItem.id }), 'quoteEditAsset');
          return lineItem;
        });
      }
      return project;
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
    this.preferencesSubscription.unsubscribe();
  }

  public onNotification(message: WzEvent): void {
    switch (message.type) {

      case 'ADD_QUOTE_FEE':
        this.store.dispatch(factory => factory.quoteEdit.addFeeTo(
          message.payload.project,
          message.payload.fee
        ));
        break;

      case 'REMOVE_QUOTE_FEE':
        this.store.dispatch(factory =>
          factory.quoteEdit.removeFee(message.payload)
        );
        break;

      case 'SHOW_COST_MULTIPLIER_DIALOG':
        this.openCostMultiplierDialog(message.payload);
        break;

      case 'REMOVE_COST_MULTIPLIER':
        this.store.dispatch(factory =>
          factory.quoteEdit.editLineItem(message.payload, { multiplier: 1 })
        );
        break;

      case 'OPEN_BULK_IMPORT_DIALOG':
        this.onOpenBulkImportDialog(message.payload);
        break;

      case 'ADD_CUSTOM_PRICE':
        this.onAddCustomPriceTo(message.payload);
        break;

      case 'OPEN_DELETE_DIALOG':
      case 'SAVE_AND_NEW':
      case 'CLONE_QUOTE':
        this.notify.emit(message);
        break;

      case 'ADD_PROJECT':
        this.store.dispatch(factory => factory.quoteEdit.addProject());
        break;

      case 'REMOVE_PROJECT':
        this.store.dispatch(factory => factory.quoteEdit.removeProject(message.payload.id));
        break;

      case 'UPDATE_PROJECT':
        this.updateProject(message.payload);
        break;

      case 'MOVE_LINE_ITEM':
        this.store.dispatch(factory =>
          factory.quoteEdit.moveLineItem(message.payload.otherProject, message.payload.lineItem)
        );
        break;

      case 'CLONE_LINE_ITEM':
        this.store.dispatch(factory => factory.quoteEdit.cloneLineItem(message.payload));
        break;

      case 'REMOVE_LINE_ITEM':
        this.store.dispatch(factory => factory.quoteEdit.removeAsset(message.payload.asset));
        break;

      case 'EDIT_LINE_ITEM':
        this.store.dispatch(factory =>
          factory.quoteEdit.editLineItem(message.payload.lineItem, message.payload.fieldToEdit)
        );
        break;

      case 'EDIT_LINE_ITEM_MARKERS':
        this.editLineItemMarkers(message.payload);
        break;

      case 'SHOW_PRICING_DIALOG':
        this.showPricingDialog(message.payload);
        break;

      case 'EDIT_PROJECT_PRICING':
        this.editProjectPricing(message.payload);
        break;

      case 'GO_TO_NEXT_TAB':
        this.goToNextTab();
        break;
    };
  }

  public get showUsageWarning(): boolean {
    return this.cartContainsAssets && !this.userCanProceed;
  }

  public get userCanProceed(): boolean {
    return (this.quoteType === 'Trial') || (this.cartContainsAssets && this.rmAssetsHaveRightsPackage);
  }

  public get cartContainsAssets(): boolean {
    return (this.store.snapshot(state => state.quoteEdit.data.itemCount) > 0);
  }

  public get total(): Observable<number> {
    return this.store.select(state => state.quoteEdit.data.total);
  }

  public get subTotal(): Observable<number> {
    return this.store.select(state => state.quoteEdit.data.subTotal);
  }

  public get discount(): Observable<string> {
    return this.store.select(state => state.quoteEdit.data.discount);
  }

  public get quoteIsTrial(): Observable<boolean> {
    return this.store.select(state => state.quoteEdit.data).map(quote => quote.purchaseType === 'Trial');
  }

  public get showDiscount(): boolean {
    return !!this.store.snapshot(factory => factory.quoteEdit.data.discount) && this.quoteType !== 'Trial';
  }

  public get shouldShowCloneButton(): Observable<boolean> {
    return this.userCan.cloneQuote(this.store.select(state => state.quoteEdit));
  }

  public get purchaseTypeConfig(): MdSelectOption[] {
    return this.config.quotePurchaseType.items;
  }

  public onSelectQuoteType(event: { type: OrderableType }): void {
    this.quoteType = event.type;
    this.config.createQuote.items.map((item: FormFields) => {
      if (item.name === 'purchaseType') {
        item.value = this.viewValueFor(event.type);
      }
      return item;
    });
  }

  private get rmAssetsHaveRightsPackage(): boolean {
    return this.store.snapshot(state => state.quoteEdit.data.projects || [])
      .filter(project => project.lineItems)
      .map(project => project.lineItems)
      .reduce((next, all) => next.concat(all))
      .filter((lineItem: Pojo) => (
        lineItem.rightsManaged === 'Rights Managed' &&
        !lineItem.hasOwnProperty('attributes')
      )).length === 0;
  }

  private onOpenBulkImportDialog(projectId: string): void {
    this.dialogService.openFormDialog(
      this.config.bulkImport.items,
      { title: 'QUOTE.BULK_IMPORT.TITLE', submitLabel: 'QUOTE.BULK_IMPORT.SUBMIT_BTN', autocomplete: 'off' },
      (rawAssets: { lineItemAttributes: string }) => {
        this.store.dispatch(factory => factory.quoteEdit.bulkImport(rawAssets, projectId));
      }
    );
  }

  private onAddCustomPriceTo(lineItem: AssetLineItem): void {
    this.dialogService.openFormDialog(
      [{
        name: 'price',
        label: 'Price',
        value: String(lineItem.grossAssetPrice),
        type: 'number',
        min: '0',
        validation: 'GREATER_THAN'
      }],
      { title: 'QUOTE.ADD_CUSTOM_PRICE_TITLE', submitLabel: 'QUOTE.ADD_CUSTOM_PRICE_SUBMIT', autocomplete: 'off' },
      (form: { price: number }) => {
        this.store.dispatch(factory => factory.quoteEdit.addCustomPriceToLineItem(lineItem, form.price));
      });
  }

  private updateProject(project: Project) {
    this.dialogService.openFormDialog(
      project.items,
      {
        dialogConfig: { position: { top: '10%' }, disableClose: false },
        title: 'CART.PROJECTS.FORM.TITLE',
        submitLabel: 'CART.PROJECTS.FORM.SUBMIT_LABEL',
        autocomplete: 'off'
      },
      (data: any) => {
        this.store.dispatch(factory => factory.quoteEdit.updateProject(Object.assign(project.project, data)));
      }
    );
  }

  private editLineItemMarkers(lineItem: AssetLineItem) {
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
                  this.store.dispatch(factory =>
                    factory.quoteEdit.editLineItemMarkers(lineItem, newMarkers)
                  );
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

  private editProjectPricing(project: Project) {
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

  private openProjectPricingDialog(priceAttributes: Array<PriceAttribute>, preferences: Pojo, project: Project): void {
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

  private applyProjectPricing(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>, project: Project) {
    switch (event.type) {
      case 'APPLY_PRICE':
        this.store.dispatch(factory =>
          factory.quoteEdit.updateProjectPriceAttributes(event.payload.attributes, project)
        );
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

  private showPricingDialog(lineItem: AssetLineItem): void {
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

  private openPricingDialog(priceAttributes: Array<PriceAttribute>, preferences: Pojo, lineItem: AssetLineItem): void {
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

  private applyPricing(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>, lineItem: AssetLineItem) {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.calculatePrice(event.payload, lineItem).subscribe((price: number) => {
          this.pricingStore.setPriceForDialog(price);
        });
        break;
      case 'APPLY_PRICE':
        this.store.dispatch(factory => factory.quoteEdit.editLineItem(lineItem, { pricingAttributes: event.payload.attributes }));
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

  private calculatePrice(attributes: Pojo, lineItem: AssetLineItem): Observable<number> {
    const markers: SubclipMarkersInterface.SubclipMarkers = (lineItem.asset as EnhancedAsset).isSubclipped ? {
      in: (lineItem.asset as EnhancedAsset).inMarkerFrame,
      out: (lineItem.asset as EnhancedAsset).outMarkerFrame
    } : null;
    return this.pricingService.getPriceFor((lineItem.asset as EnhancedAsset), attributes, markers);
  }

  private mapAttributesToPreferences(attributes: any): Pojo {
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

  private openCostMultiplierDialog(lineItem: AssetLineItem): void {
    this.dialogService.openFormDialog(
      this.costMultiplierFormItems(lineItem),
      { title: this.costMultiplierFormTitle(lineItem), submitLabel: this.costMultiplierFormSubmitLabel(lineItem) },
      (result: { multiplier: string }): void => {
        this.store.dispatch(factory => factory.quoteEdit.editLineItem(lineItem, result));
      });
  }

  private costMultiplierFormItems(lineItem: AssetLineItem): Array<FormFields> {
    return lineItem.multiplier > 1 ?
      [Object.assign({}, this.config.addCostMultiplier.items[0], { value: lineItem.multiplier })] :
      this.config.addCostMultiplier.items;
  }

  private costMultiplierFormTitle(lineItem: AssetLineItem): string {
    return lineItem.multiplier > 1 ? 'QUOTE.EDIT_MULTIPLIER_TITLE' : 'QUOTE.ADD_MULTIPLIER_TITLE';
  }

  private costMultiplierFormSubmitLabel(lineItem: AssetLineItem): string {
    return lineItem.multiplier > 1 ? 'QUOTE.EDIT_MULTIPLIER_FORM_SUBMIT' : 'QUOTE.ADD_MULTIPLIER_FORM_SUBMIT';
  }

  private viewValueFor(quoteType: OrderableType): string {
    return this.purchaseTypeConfig.filter((option: { viewValue: string, value: OrderableType }) => {
      return option.value === quoteType;
    }).map((option: MdSelectOption) => option.viewValue)[0];
  }
}
