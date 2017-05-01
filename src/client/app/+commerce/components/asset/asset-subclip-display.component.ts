import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Frame, TimecodeFormat } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'asset-subclip-display-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="asset.timeStart !== -2" class="asset-sub-clip md-caption">
      <strong>{{ 'COLLECTION.SHOW.SUB_CLIPPING_LABEL' | translate }} </strong>
      <div class="subclip-timeline">
        <span class="subclip-segment" [ngStyle]="calcSubClipSegments(asset)"></span>
      </div>
      <ul class="subclip-data" layout="row" hide-sm>
        <li flex-gt-sm="30" flex-gt-md="25" flex="35">
          <strong>{{ 'COLLECTION.SHOW.START_TIME_LABEL' | translate }} </strong>
          {{frame(asset.metadata[2].value, asset.timeStart - 0) | timecode}}
        </li>
        <li flex="none">
          <strong>{{ 'COLLECTION.SHOW.END_TIME_LABEL' | translate }} </strong>
          {{frame(asset.metadata[2].value, asset.timeEnd - 0) | timecode}}
        </li>
        <li flex="" layout-align="end center">
          <strong>{{ 'COLLECTION.SHOW.SUB_CLIP_LENGTH_LABEL' | translate }} </strong>
          {{frame(asset.metadata[2].value, asset.timeEnd - asset.timeStart) | timecode}}
        </li>
      </ul>
    </div>
  `
})
export class AssetSubclipDisplayComponent {
  @Input() asset: any;

  public frame(framesPerSecond: any, frameNumber: any) {
    return new Frame(framesPerSecond.split(' fps')[0]).setFromFrameNumber(frameNumber);
  }

  public calcSubClipSegments(asset: any) {
    let lengthAsSeconds: number = asset.metadata[5].value / 1000.0;
    let totalFrames: number = this.durationAsFrames(asset.metadata[2].value, lengthAsSeconds);
    let startPoint: number = this.calcSegmentWidthPecentage(asset.timeStart, totalFrames);
    let segmentWidth: number = this.calcSegmentWidthPecentage(asset.timeEnd - asset.timeStart, totalFrames);
    return { 'width.%': segmentWidth, 'margin-left.%': startPoint, 'min-width.px': 2 };
  }

  private durationAsFrames(framesPerSecond: any, duration: any) {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }

  private calcSegmentWidthPecentage(startFrame: number, totalFrames: number) {
    return startFrame * 100 / totalFrames;
  }
}
