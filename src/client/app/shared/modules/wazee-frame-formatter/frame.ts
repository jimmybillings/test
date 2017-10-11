import { TimecodeGenerator } from './timecodeGenerator';
import { TimecodeFormat } from './timecodeFormat';
import { TimecodeParser } from './timecodeParser';
import { TimecodeBase } from './timecodeBase';

const MATH = Math;

export class Frame {
  public framesPerSecond: number;
  public _timecodeGenerator: TimecodeGenerator;
  public _timecodeParser: TimecodeParser;
  public sourceBasedOffsetFrames: any;
  public frameNumber: number;

  constructor(framesPerSecond: number, sourceBasedOffset?: string | number) {
    if (sourceBasedOffset == null) {
      sourceBasedOffset = 0;
    }
    this.setFramesPerSecondTo(framesPerSecond);
    this.setSourceBasedOffsetTo(sourceBasedOffset);
  }

  stringToFrameNumber(framesPerSecond: number, string: string, format?: any, base?: any): number {
    if (format == null) {
      format = TimecodeFormat.SIMPLE_TIME_CONVERSION;
    }
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    return new Frame(framesPerSecond).setFromString(string, format, base).asFrameNumber();
  };

  setFramesPerSecondTo(value: number): Frame {
    if (value == null) {
      return this;
    }
    this.framesPerSecond = value;
    if (this.framesPerSecond === 23.98) {
      this.framesPerSecond = 23.976;
    }
    this._timecodeGenerator = new TimecodeGenerator(this.framesPerSecond);
    this._timecodeParser = new TimecodeParser(this.framesPerSecond);
    return this;
  };

  setSourceBasedOffsetTo(value: any): void {
    this.sourceBasedOffsetFrames = value.constructor === String ? this.stringToFrameNumber(this.framesPerSecond, value) : value;
  };

  setFromFrameNumber(frameNumber: number, base?: string): Frame {
    this.frameNumber = frameNumber;
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    if (base === TimecodeBase.SOURCE_BASED) {
      this.addFrames(-this.sourceBasedOffsetFrames);
    }
    if (this.frameNumber < 0) {
      this.frameNumber = 0;
    }
    return this;
  };

  setFromSeconds(value: number, base?: string): Frame {
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    this.setFromFrameNumber(MATH.round(this.framesPerSecond * value), base);
    return this;
  };

  setFromString(string: string, format: string, base?: string): Frame {
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    this.setFromFrameNumber(this._timecodeParser.asFrameNumber(string, format), base);
    return this;
  };

  addFrames(numberOfFrames: number): Frame {
    this.frameNumber += numberOfFrames;
    return this;
  };

  asFrameNumber(base?: string): number {
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    return this._frameNumberFor(base);
  };

  asSeconds(digitsAfterDecimal?: number, base?: string): number {
    var multiplier, seconds;
    if (digitsAfterDecimal == null) {
      digitsAfterDecimal = -1;
    }
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    seconds = this._frameNumberFor(base) / this.framesPerSecond;
    if (digitsAfterDecimal < 0) {
      return seconds;
    }
    multiplier = MATH.pow(10, digitsAfterDecimal);
    return MATH.round(multiplier * seconds) / multiplier;
  };

  asMilliseconds(digitsAfterDecimal?: number, base?: string): number {
    var multiplier, seconds;

    if (digitsAfterDecimal == null) {
      digitsAfterDecimal = 0;
    }
    
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }

    multiplier = MATH.pow(10, digitsAfterDecimal);

    seconds = this._frameNumberFor(base) / this.framesPerSecond;
    
    return MATH.round(1000 * multiplier * seconds) / multiplier;
  };

  asString(format: string, base?: string) {
    if (base == null) {
      base = TimecodeBase.STREAM_BASED;
    }
    switch (format) {
      case TimecodeFormat.FRAMECOUNT:
        return this.asFrameNumber(base) + '';
      case TimecodeFormat.SECONDS:
        return this.asSeconds(3, base).toFixed(3) + '';
      default:
        return this._timecodeGenerator.setFromFrameNumber(this._frameNumberFor(base)).asString(format);
    }
  };

  _frameNumberFor(base: string): number {
    return this.frameNumber + (base === TimecodeBase.SOURCE_BASED ? this.sourceBasedOffsetFrames : 0);
  };
}
