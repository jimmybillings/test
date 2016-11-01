import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { TranscodeTarget } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-transcode-select',
  templateUrl: 'wz.transcode-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzTranscodeSelectComponent implements OnChanges {
  @Input() transcodeTargetMap: Array<TranscodeTarget>;
  @Output() selectTarget: any = new EventEmitter();

  ngOnChanges(changes: any): void {
    console.log(changes.transcodeTargetMap.currentValue);
  }

  public get selectedTarget(): TranscodeTarget {
    return this.transcodeTargetMap.filter((target: TranscodeTarget) => {
      return target.selected;
    })[0];
  }

  public onSelectTarget(target: TranscodeTarget): void {
    this.selectTarget.emit(target);
  }
}