import { Pipe, PipeTransform } from '@angular/core';

import { PlayerState } from '../interfaces/player.interface';
import { Frame, TimecodeFormat, TimecodeBase } from '../../wazee-frame-formatter/index';

@Pipe({ name: 'playerTimecode' })
export class PlayerTimecodePipe implements PipeTransform {
  public transform(frame: Frame, state: PlayerState, format?: TimecodeFormat, base?: TimecodeBase): string {
    if (!frame) return '';

    const chosenFormat: TimecodeFormat = format || (state ? state.timecodeFormat : TimecodeFormat.SIMPLE_TIME_CONVERSION);
    const chosenBase: TimecodeBase = base || (state ? state.timecodeBase : TimecodeBase.STREAM_BASED);

    return frame.asString(chosenFormat, chosenBase);
  }
}
