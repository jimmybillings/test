import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Frame, TimecodeFormat } from 'wazee-frame-formatter';
import { Asset, Metadatum } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'cart-asset-component',
  templateUrl: 'asset.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetComponent implements OnInit {
  @Input() asset: Asset;
  @Output() assetNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public metadata: any = {};

  public ngOnInit(): void {
    this.cacheMetadata();
  }

  public durationAsFrames(framesPerSecond: any, duration: any) {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }

  public calcSegmentWidthPecentage(startFrame: number, totalFrames: number) {
    return startFrame * 100 / totalFrames;
  }

  public calcSubClipSegments(asset: any) {
    let lengthAsSeconds: number = asset.metadata[5].value / 1000.0;
    let totalFrames: number = this.durationAsFrames(asset.metadata[2].value, lengthAsSeconds);
    let startPoint: number = this.calcSegmentWidthPecentage(asset.timeStart, totalFrames);
    let segmentWidth: number = this.calcSegmentWidthPecentage(asset.timeEnd - asset.timeStart, totalFrames);
    return { 'width.%': segmentWidth, 'margin-left.%': startPoint, 'min-width.px': 2 };
  }

  private cacheMetadata(): void {
    this.asset.metadata.forEach((metadatum: Metadatum) => {
      this.metadata[metadatum.name] = metadatum.value;
    });
  }
}
