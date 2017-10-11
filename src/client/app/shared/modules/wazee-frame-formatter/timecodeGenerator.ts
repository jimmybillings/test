import { TimecodeFormat } from './timecodeFormat';
import { Time } from './time';

const MATH = Math;
const DEFAULT_TIME_CODE_LENGTH = 'hh:mm:ss:ff'.length;

export class TimecodeGenerator {
  public framesPerSecond: number;
  public accurateFramesPerSecond: number;
  public frameNumber: number;
  public _time: Time;

  // ------- STATIC (CLASS) METHODS -------
  static extraFramesNeededForDropFrame(framesPerSecond: number, time: Time): number {
    switch (framesPerSecond) {
      case 29.97:
        return TimecodeGenerator.extraFramesNeededFor2997DropFrame(time);
      case 59.94:
        return TimecodeGenerator.extraFramesNeededFor5994DropFrame(time);
      case 23.976:
        return TimecodeGenerator.extraFramesNeededFor23976DropFrame(time);
      default:
        return 0;
    }
  };

  static extraFramesNeededFor2997DropFrame(time: Time): number {
    var minutes, minutesOnesDigit, minutesTensDigit;
    minutes = time.getMinutes();
    minutesTensDigit = MATH.floor(minutes / 10);
    minutesOnesDigit = minutes % 10;
    return (time.getHours() * 108) + (minutesTensDigit * 18) + (minutesOnesDigit * 2);
  };

  static extraFramesNeededFor5994DropFrame(time: Time): number {
    return TimecodeGenerator.extraFramesNeededFor2997DropFrame(time) * 2;
  };

  static extraFramesNeededFor23976DropFrame(time: Time): number {
    var extra, hours, i, len, minutes, ref, specialMinute;
    hours = time.getHours();
    minutes = time.getMinutes();
    extra = hours * 60;
    extra += (MATH.floor((hours + 1) / 3) + MATH.floor(hours / 3)) * 26;
    extra += minutes;
    if (!time.hoursMultipleOf(3)) {
      extra += MATH.floor(minutes * 0.5);
      ref = [16, 30, 44];
      for (i = 0, len = ref.length; i < len; i++) {
        specialMinute = ref[i];
        if (minutes >= specialMinute) {
          extra -= 1;
        }
      }
    }
    return extra;
  };

  constructor(framesPerSecond1?: number) {
    var integralFramesPerSecond;
    this.framesPerSecond = framesPerSecond1;
    this._time = new Time(this.framesPerSecond);
    integralFramesPerSecond = MATH.round(this.framesPerSecond);
    this.accurateFramesPerSecond = this.framesPerSecond === integralFramesPerSecond ?
      this.framesPerSecond : integralFramesPerSecond * 1000 / 1001;
  }

  // ------- PUBLIC INTERFACE -------

  public setFromFrameNumber(frameNumber: number): TimecodeGenerator {
    this.frameNumber = frameNumber;
    return this;
  };

  public asString(format: string, minLength?: number): string {
    var frameDelimiter, frames, rawSeconds, truncatedSeconds;
    if (minLength === null) {
      minLength = DEFAULT_TIME_CODE_LENGTH;
    }
    frameDelimiter = ':';
    this._time.clear();
    switch (format) {
      case TimecodeFormat.NONDROPFRAME:
        this._time.setFrames(this.frameNumber);
        break;
      case TimecodeFormat.DROPFRAME:
        this._time.setFrames(this.frameNumber);
        this._addDropFramesIfNecessary();
        frameDelimiter = ';';
        break;
      case TimecodeFormat.SIMPLE_TIME_CONVERSION:
      case TimecodeFormat.MINIMAL_TIME_CONVERSION:
        rawSeconds = this.frameNumber / this.accurateFramesPerSecond;
        truncatedSeconds = MATH.floor(rawSeconds);
        frames = MATH.round((rawSeconds - truncatedSeconds) * this.framesPerSecond);
        this._time.setSeconds(truncatedSeconds).setFrames(frames);
        frameDelimiter = ';';
    }
    switch (format) {
      case TimecodeFormat.MINIMAL_TIME_CONVERSION:
        return this._minimallyFormatTime();
      default:
        return this._formatTime(minLength, frameDelimiter);
    }
  };

  // ------- PRIVATE METHODS -------

  private _addDropFramesIfNecessary(): void {
    var extraExtraFrames: number,
    extraFrames: number,
    hours: number,
    minutes: number,
    originalHours: number,
    originalMinutes: number;
    originalMinutes = this._time.getMinutes();
    originalHours = this._time.getHours();
    extraFrames = TimecodeGenerator.extraFramesNeededForDropFrame(this.framesPerSecond, this._time);
    if (!(extraFrames > 0)) {
      return null;
    }
    this._time.addFrames(extraFrames);
    switch (this.framesPerSecond) {
      case 29.97:
        if (this._time.getMinutes() > originalMinutes && !this._time.minutesMultipleOf(10)) {
          this._time.addFrames(2);
        }
        break;
      case 59.94:
        if (this._time.getMinutes() > originalMinutes && !this._time.minutesMultipleOf(10)) {
          this._time.addFrames(4);
        }
        break;
      case 23.976:
        extraExtraFrames = 0;
        minutes = this._time.getMinutes();
        hours = this._time.getHours();
        if (minutes > originalMinutes) {
          extraExtraFrames += minutes - originalMinutes;
          if (!this._time.hoursMultipleOf(3) &&
            this._time.minutesMultipleOf(2) &&
            !this._time.minutesOneOf([0, 16, 30, 44])) {
            extraExtraFrames += 1;
          }
        }
        if (hours > originalHours) {
          extraExtraFrames += 1;
        }
        this._time.addFrames(extraExtraFrames);
    }
  };

  private _formatTime(minLength: number, frameDelimiter: string): string {
    if (frameDelimiter === null) {
      frameDelimiter = ':';
    }
    return this._zeroFillTo(minLength, this._time.getHours() + ':' +
      this._zeroFillTo(2, this._time.getMinutes()) + ':' +
      this._zeroFillTo(2, this._time.getSeconds()) +
      frameDelimiter + this._zeroFillTo(2, this._time.getFrames()));
  };

  private _minimallyFormatTime(): string {
    var frames: number,
    hours: number,
    minutes: number,
    outputPieces: Array<string>,
    ref: Array<number>;
    ref = [this._time.getHours(),this._time.getMinutes(),this._time.getFrames()];
    hours = ref[0];
    minutes = ref[1];
    frames = ref[2];
    outputPieces = [this._zeroFillTo(2, this._time.getSeconds())];
    if (minutes > 0) {
      outputPieces.unshift(this._zeroFillTo(2, minutes) + ':');
    }
    if (hours > 0) {
      outputPieces.unshift(this._zeroFillTo(2, hours) + ':');
    }
    if (frames > 0) {
      outputPieces.push(';' + this._zeroFillTo(2, frames));
    }
    return outputPieces.join('');
  };

  private _zeroFillTo(minNumberOfDigits: number, number: number | string): string {
    var output: string;
    output = number + '';
    while (output.length < minNumberOfDigits) {
      output = '0' + output;
    }
    return output;
  };
}
