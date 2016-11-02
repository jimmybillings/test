import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { TranscodeTarget } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-transcode-select',
  templateUrl: 'wz.transcode-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzTranscodeSelectComponent implements OnChanges {
  @Input() transcodeTargets: Array<TranscodeTarget>;
  @Output() selectTarget: any = new EventEmitter();

  ngOnChanges(changes: any): void {
    this.transcodeTargets = this.format(changes.transcodeTargets.currentValue);
  }

  public get selectedTarget(): TranscodeTarget {
    return this.transcodeTargets.filter((target: TranscodeTarget) => {
      return target.selected;
    })[0];
  }

  public onSelectTarget(target: TranscodeTarget): void {
    this.toggleTargets(target);
    this.selectTarget.emit(target);
  }

  private format(transcodeTargets: any): Array<TranscodeTarget> {
    return transcodeTargets.map((target: string, i: number) => {
      let name: string = target;
      let selected: boolean = i === 0 ? true : false;
      return { name: name, selected: selected };
    });
  }

  private toggleTargets(selectedTarget: TranscodeTarget): Array<TranscodeTarget> {
    return this.transcodeTargets.map((target: TranscodeTarget) => {
      target.selected = false;
      if (target === selectedTarget) target.selected = true;
      return target;
    });
  }
}