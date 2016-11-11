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
  @Output() selectTarget: any = new EventEmitter();

  public onSelectTarget(target: TranscodeTarget): void {
    this.transcodeTargets = this.toggleTargets(target);
    this.selectTarget.emit(this.selectedTarget());
  }

  public selectedTarget() {
    let target = this.transcodeTargets.filter((target: TranscodeTarget) => target.selected === true);
    return (target.length > 0) ? target[0] : this.transcodeTargets[0];
  }

  private toggleTargets(selectedTarget: TranscodeTarget): Array<TranscodeTarget> {
    return this.transcodeTargets.map((target: TranscodeTarget) => {
      target.selected = (target.name === selectedTarget.name) ? true : false;
      return target;
    });
  }
}