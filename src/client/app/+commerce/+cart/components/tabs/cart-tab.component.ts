import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html'
})

export class CartTabComponent extends Tab implements OnInit, OnDestroy {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public config: any;
  private configSubscription: Subscription;

  constructor(
    public userCan: Capabilities,
    private cartService: CartService,
    private uiConfig: UiConfig,
    private dialog: MdDialog,
    private assetService: AssetService,
    private window: Window) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.configSubscription = this.uiConfig.get('cart').subscribe((config: any) => this.config = config.config);
  }

  public ngOnDestroy() {
    this.configSubscription.unsubscribe();
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
    };
  }

  private editAsset(payload: any) {
    this.assetService.getClipPreviewData(payload.asset.assetId).subscribe(data => {
      payload.asset.clipUrl = data.url;
      payload.asset.timeStart = payload.asset.startTime;
      payload.asset.timeEnd = payload.asset.endTime;
      let dialogRef: MdDialogRef<WzAdvancedPlayerComponent> = this.dialog.open(WzAdvancedPlayerComponent, { width: '800px' });
      Object.assign(dialogRef.componentInstance, { window: this.window, asset: payload.asset });
      dialogRef.componentInstance.onSubclip.subscribe((data: any) => {
        payload.asset.startTime = data.in;
        payload.asset.endTime = data.out;
        this.cartService.editLineItem(payload, {});
        dialogRef.close();
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
