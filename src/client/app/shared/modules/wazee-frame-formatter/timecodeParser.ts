import { Time } from './time';
import { TimecodeFormat } from './timecodeFormat';
import { TimecodeGenerator } from './timecodeGenerator';

const MATH = Math;

export class TimecodeParser {
  public timecodeGenerator: TimecodeGenerator;
  public framesPerSecond: number;
  public accurateFramesPerSecond: number;
  public _timePieces: Array<string>;
  public _time: Time;

  constructor(framesPerSecond: number) {
    let integralFramesPerSecond;
    this.timecodeGenerator = new TimecodeGenerator();
    this.framesPerSecond = framesPerSecond;
    this._time = new Time(this.framesPerSecond);
    integralFramesPerSecond = MATH.round(this.framesPerSecond);
    this.accurateFramesPerSecond = this.framesPerSecond === integralFramesPerSecond ?
      this.framesPerSecond : integralFramesPerSecond * 1000 / 1001;
  }

  public asFrameNumber(string: string, format: string): number {
    this._parseTimeFrom(string, format);
    this._adjustFramesFor(format);
    return this._time.asFrameNumber();
  };

  public _parseTimeFrom(string: string, format?: string): TimecodeParser {
    var ref;
    if (format === TimecodeFormat.SECONDS) {
      this._time.clear().setFrames(MATH.round(parseFloat(string) * this.accurateFramesPerSecond));
      return this;
    }
    if (format === TimecodeFormat.MINIMAL_TIME_CONVERSION) {
      if (!(string.indexOf(';') >= 0 || ((ref = string.match(/:/g)) !== null ? ref.length : void 0) === 3)) {
        string += ';00';
      }
    }
    string = string.replace(';', ':');
    this._timePieces = string.split(':').reverse();
    while (this._timePieces.length < 4) {
      this._timePieces.push('0');
    }
    this._time.clear();
    this._time.setHours(this._getTimePieceAtIndex(3));
    this._time.setMinutes(this._getTimePieceAtIndex(2));
    this._time.setSeconds(this._getTimePieceAtIndex(1));
    this._time.setFrames(this._getTimePieceAtIndex(0));
    return this;
  };

  public _getTimePieceAtIndex(index: number): number {
    return parseInt(this._timePieces[index], 10) || 0;
  };

  public _adjustFramesFor(format: string): TimecodeParser {
    var adjustedFrames;
    switch (format) {
      case TimecodeFormat.NONDROPFRAME:
        // null;
        break;
      case TimecodeFormat.DROPFRAME:
        this._time.addFrames(-TimecodeGenerator.extraFramesNeededForDropFrame(this.framesPerSecond, this._time));
        break;
      case TimecodeFormat.SIMPLE_TIME_CONVERSION:
      case TimecodeFormat.MINIMAL_TIME_CONVERSION:
        adjustedFrames = MATH.round(this._time.totalWholeSeconds() * this.accurateFramesPerSecond) + this._time.getFrames();
        this._time.clear().setFrames(adjustedFrames);
    }
    return this;
  };
}
