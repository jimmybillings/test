import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  ViewContainerRef,
  Renderer,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import {
  Viewport,
  Coords,
  Asset
} from '../../../interfaces/common.interface';
import {
  OverlayState,
  OverlayRef,
  Overlay,
  GlobalPositionStrategy,
  TemplatePortalDirective,
  ComponentPortal
} from '@angular/material';
import { WzSpeedviewComponent } from './wz.speedview.component';
import { AssetService } from '../../../services/asset.service';
import {
  SpeedviewData,
  SpeedviewEvent
} from '../../../interfaces/asset.interface';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

const previewWidth: number = 420;     // How wide the speed preview dialog is
const previewHeight: number = 300;    // How tall the speed preview dialog is
const horizontalPadding: number = 10; // How much room we want on each side of the speed preview
const verticalPadding: number = 20;   // How much room we want above and below the preview
const delay: number = 333;            // How long we want to wait before showing the preview

@Directive({ selector: '[wzSpeedview]' })
export class WzSpeedviewDirective implements OnDestroy {

  @Input()
  set wzSpeedview(value: Asset) {
    this.currentAsset = value;
  }
  private timeout: any;
  private viewport: Viewport;
  private config: OverlayState = new OverlayState();
  private speedViewInstance: WzSpeedviewComponent;
  private overlayRef: OverlayRef;
  private previewSubscription: Subscription;
  private scollListener: any;
  private currentAsset: any;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private assetService: AssetService,
    private renderer: Renderer,
    private detector: ChangeDetectorRef) { }

  @HostListener('mouseenter', ['$event']) public onMouseEnter($event: any): void {
    if (window.innerWidth <= previewWidth) return;
    this.viewport = $event.currentTarget.getBoundingClientRect();
    this.overlayRef = this.prepareOverlay();
    this.show(this.speedViewComponent());
  }

  @HostListener('mouseleave', ['$event']) public onMouseLeave(): void {
    this.disposeSpeedview();
  }

  ngOnDestroy() {
    this.disposeSpeedview();
  }

  private prepareOverlay() {
    this.config.positionStrategy = this.positionStrategy(this.previewPosition);
    return this.overlay.create(this.config);
  }

  private speedViewComponent() {
    return new ComponentPortal(WzSpeedviewComponent, this.viewContainerRef);
  }

  private show(component: ComponentPortal<WzSpeedviewComponent>): void {
    this.previewSubscription = this.loadSpeedViewData()
      .subscribe((data: SpeedviewData) => {
        this.speedViewInstance = this.overlayRef.attach(component).instance;
        this.speedViewInstance.speedviewAssetInfo = data;
        this.detector.markForCheck();
      });

    this.scollListener = this.renderer.listenGlobal('document', 'scroll', () => this.disposeSpeedview());
  }

  private loadSpeedViewData(): Observable<SpeedviewData> {
    if (this.currentAsset.speedviewData) {
      return Observable.of(this.currentAsset.speedviewData);
    } else {
      return this.assetService.getSpeedviewData(this.currentAsset.assetId);
    }
  }

  /** Disposes the current speed preview and the overlay it is attached to */
  private disposeSpeedview(): void {

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    if (this.previewSubscription) {
      this.previewSubscription.unsubscribe();
    }

    if (this.scollListener) {
      this.scollListener();
    }

    this.speedViewInstance = null;
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

  private positionStrategy(coordinates: Coords): GlobalPositionStrategy {
    return this.overlay
      .position()
      .global()
      .top(`${coordinates.y}px`)
      .left(`${coordinates.x}px`);
  }
}
