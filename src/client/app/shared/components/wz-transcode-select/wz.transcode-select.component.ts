import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TranscodeTarget } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-transcode-select',
  templateUrl: 'wz.transcode-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzTranscodeSelectComponent {
  @Input() transcodeTargets: Array<TranscodeTarget>;
  @Input() selectedTarget: any;
  @Output() selectTarget: any = new EventEmitter();

  public onSelectTarget(target: TranscodeTarget): void {
    this.toggleTargets(target);
    this.selectTarget.emit(target);
  }

  private toggleTargets(selectedTarget: TranscodeTarget): Array<TranscodeTarget> {
    return this.transcodeTargets.map((target: TranscodeTarget) => {
      target.selected = false;
      if (target.name === selectedTarget.name) target.selected = true;
      return target;
    });
  }
}