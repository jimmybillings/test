import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  ViewContainerRef,
  Renderer,
  Input,
  OnDestroy
} from '@angular/core';

import {
  OverlayState,
  OverlayRef,
  Overlay,
  GlobalPositionStrategy,
  TemplatePortalDirective,
  ComponentPortal
} from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {
  SpeedviewData,
  SpeedviewEvent
} from '../../../interfaces/asset.interface';

import {
  Viewport,
  Coords
} from '../../../interfaces/common.interface';
import { EnhancedAsset } from '../../../interfaces/enhanced-asset';

import { State as SpeedPreviewStore } from '../../../../store/states/speed-preview.state';
import { WzSpeedviewComponent } from './wz.speedview.component';

import { AppStore } from '../../../../app.store';

const previewWidth: number = 420;     // How wide the speed preview dialog is
const previewHeight: number = 300;    // How tall the speed preview dialog is
const horizontalPadding: number = 10; // How much room we want on each side of the speed preview
const verticalPadding: number = 20;   // How much room we want above and below the preview
const delay: number = 200;            // How long we want to wait before showing the preview

@Directive({ selector: '[wzSpeedview]' })
export class WzSpeedviewDirective implements OnDestroy {

  @Input()
  set wzSpeedview(value: EnhancedAsset) {
    this.enhancedAsset = Object.assign(new EnhancedAsset(), value).normalize();
  }

  private viewport: Viewport;
  private config: OverlayState;
  private speedViewInstance: WzSpeedviewComponent;
  private overlayRef: OverlayRef;
  private speedViewDataSubscription: Subscription;
  private scollListener: Function;
  private enhancedAsset: EnhancedAsset;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private renderer: Renderer,
    private store: AppStore) {
    this.config = new OverlayState();
  }

  @HostListener('mouseenter', ['$event']) public onMouseEnter($event: any): void {
    if (window.innerWidth <= previewWidth) return;
    this.viewport = $event.currentTarget.getBoundingClientRect();
    this.loadSpeedView();
  }

  @HostListener('mouseleave', ['$event']) public onMouseLeave(): void {
    this.destroySpeedView();
  }

  ngOnDestroy() {
    this.destroySpeedView();
  }

  private loadSpeedView(): void {
    this.overlayRef = this.loadOverlay;
    this.displaySpeedViewDialog();

    this.speedViewDataSubscription = this.loadSpeedViewData
      .subscribe(() => this.setSpeedviewAssetInfo());

    this.scollListener = this.renderer
      .listenGlobal('document', 'scroll', () => this.destroySpeedView());
  }

  private displaySpeedViewDialog(): void {
    this.speedViewInstance = this.overlayRef.attach(this.speedViewComponent).instance;
    this.speedViewInstance.setSpeedViewPosterUrl(this.enhancedAsset.thumbnailUrl);
    this.speedViewInstance!.show();
  }

  private setSpeedviewAssetInfo(): void {
    this.speedViewInstance.setSpeedviewAssetInfo(this.speedViewData);
  }

  /** Disposes the current speed preview and the overlay it is attached to */
  private destroySpeedView(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    if (this.speedViewDataSubscription) {
      this.speedViewDataSubscription.unsubscribe();
    }

    if (this.scollListener) {
      this.scollListener();
    }

    this.speedViewInstance = null;
  }

  private positionStrategy(coordinates: Coords): GlobalPositionStrategy {
    return this.overlay
      .position()
      .global()
      .top(`${coordinates.y}px`)
      .left(`${coordinates.x}px`);
  }

  private get loadOverlay(): OverlayRef {
    this.config.positionStrategy = this.positionStrategy(this.previewPosition);
    return this.overlay.create(this.config);
  }

  private get speedViewDataIsLoaded(): boolean {
    return this.store.snapshot(state => state.speedPreview[this.enhancedAsset.assetId]) !== undefined;
  }

  private get speedViewComponent(): ComponentPortal<WzSpeedviewComponent> {
    return new ComponentPortal(WzSpeedviewComponent, this.viewContainerRef);
  }

  private get speedViewData(): SpeedviewData {
    return this.store.snapshot(state => state.speedPreview[this.enhancedAsset.assetId]);
  }

  private get loadSpeedViewData(): Observable<boolean> {
    if (this.speedViewDataIsLoaded) {
      return Observable.of(true);
    } else {
      this.store.dispatch(factory => factory.speedPreview.load(this.enhancedAsset));
      return this.store.blockUntil(state => !!state.speedPreview[this.enhancedAsset.assetId]);
    }
  }

  // Determines the x and y coordinate that the preview's top left corner should start at
  private get previewPosition(): Coords {
    let x: number = this.determineHorizontalPreviewPlacement;
    let y: number = this.determineVerticalPreviewPlacement;
    return { x, y };
  }

  // Returns an x coordinate based on the position of the element that was hovered upon
  // if there is no room to the right, it shifts the preview left by its width, and the width of the horizontal padding
  private get determineHorizontalPreviewPlacement(): number {
    if (this.roomToTheRight) {
      return this.viewport.right + horizontalPadding;
    } else {
      return this.viewport.left - previewWidth - horizontalPadding;
    }
  }

  // Returns a y coordinate based on the position of the element that was hovered upon
  // if there is not room on the bottom, it shifts the preview up by its height, and half the height of the hovered element
  private get determineVerticalPreviewPlacement(): number {
    if (this.roomBelow && this.roomAbove) {
      return this.viewport.top - (previewHeight / 3);
    } else if (!this.roomBelow) {
      return window.innerHeight - previewHeight - verticalPadding;
    } else {
      return 0 + verticalPadding;
    }
  }

  // Returns true if there is at least 10px to the right of the hovered element
  private get roomToTheRight(): boolean {
    return window.innerWidth - this.viewport.right - previewWidth >= horizontalPadding;
  }

  // Returns true if there is at least 20px above the hovered element
  private get roomAbove(): boolean {
    return 0 + this.viewport.top - (previewHeight / 3) >= verticalPadding;
  }

  // Returns true if there is at least 20px below the hovered element
  private get roomBelow(): boolean {
    return window.innerHeight - (this.viewport.top - (previewHeight / 3) + previewHeight) >= verticalPadding;
  }
}
