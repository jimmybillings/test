import { Pipe, PipeTransform } from '@angular/core';

import { PlayerState } from '../interfaces/player.interface';
import { Frame, TimecodeFormat, TimecodeBase } from '../../wazee-frame-formatter/index';

@Pipe({ name: 'playerTimecode' })
export class PlayerTimecodePipe implements PipeTransform {
  public transform(frame: Frame, state: PlayerState, format?: TimecodeFormat, base?: TimecodeBase): string {
    if (!frame) return '';

    const chosenFormat: TimecodeFormat =
      format == null // Very deliberate '==' here to check that enum value (which could be 0) is defined and not null!
        ? (state ? state.timecodeFormat : TimecodeFormat.SIMPLE_TIME_CONVERSION)
        : format;

    const chosenBase: TimecodeBase =
      base == null // Very deliberate '==' here to check that enum value (which could be 0) is defined and not null!
        ? (state ? state.timecodeBase : TimecodeBase.STREAM_BASED)
        : base;

    return frame.asString(chosenFormat, chosenBase);
  }
}
