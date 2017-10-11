const MATH = Math;
const MINUTES_IN_AN_HOUR = 60;
const SECONDS_IN_A_MINUTE = 60;
const SECONDS_IN_AN_HOUR = SECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;

const slice = [].slice;
const indexOf = [].indexOf ||
  function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    } return -1; };

export class Time {
  public _integralFramesPerSecond: number;
  public _hours: number;
  public _minutes: number;
  public _seconds: number;
  public _frames: number;

  constructor(framesPerSecond: number) {
    this.clear();
    this._integralFramesPerSecond = MATH.round(framesPerSecond);
  }

  public clear() {
    this._hours = this._minutes = this._seconds = this._frames = 0;
    return this;
  };

  public setFrames(_frames: number) {
    this._frames = _frames;
    return this;
  };

  public getFrames() {
    this._rollComponentsIfNecessary();
    return this._frames;
  };

  public addFrames(numberOfFrames: number) {
    this._frames += numberOfFrames;
    return this;
  };

  public setSeconds(_seconds: number) {
    this._seconds = _seconds;
    return this;
  };

  public getSeconds() {
    this._rollComponentsIfNecessary();
    return this._seconds;
  };

  public setMinutes(_minutes: number) {
    this._minutes = _minutes;
    return this;
  };

  public getMinutes() {
    this._rollComponentsIfNecessary();
    return this._minutes;
  };

  public setHours(_hours: number) {
    this._hours = _hours;
    return this;
  };

  public getHours() {
    this._rollComponentsIfNecessary();
    return this._hours;
  };

  public hoursMultipleOf(value: number) {
    return (this.getHours() % value) === 0;
  };

  public minutesMultipleOf(value: number) {
    return (this.getMinutes() % value) === 0;
  };

  public minutesOneOf(args?: Array<number>) {
    var ref, specialMinutes;
    specialMinutes = 1 <= args.length ? slice.call(args, 0) : [];
    return ref = this.getMinutes(), indexOf.call(specialMinutes, ref) >= 0;
  };

  public asFrameNumber() {
    return this.totalWholeSeconds() * this._integralFramesPerSecond + this._frames;
  };

  public totalWholeSeconds() {
    this._rollComponentsIfNecessary();
    return this._hours * SECONDS_IN_AN_HOUR + this._minutes * SECONDS_IN_A_MINUTE + this._seconds;
  };

  public _rollComponentsIfNecessary() {
    while (this._frames < 0) {
      this._frames += this._integralFramesPerSecond;
      this._seconds -= 1;
    }
    while (this._seconds < 0) {
      this._seconds += SECONDS_IN_A_MINUTE;
      this._minutes -= 1;
    }
    while (this._minutes < 0) {
      this._minutes += MINUTES_IN_AN_HOUR;
      this._hours -= 1;
    }
    if (this._frames >= this._integralFramesPerSecond) {
      this._seconds += MATH.floor(this._frames / this._integralFramesPerSecond);
      this._frames %= this._integralFramesPerSecond;
    }
    if (this._seconds >= SECONDS_IN_A_MINUTE) {
      this._minutes += MATH.floor(this._seconds / SECONDS_IN_A_MINUTE);
      this._seconds %= SECONDS_IN_A_MINUTE;
    }
    if (this._minutes >= MINUTES_IN_AN_HOUR) {
      this._hours += MATH.floor(this._minutes / MINUTES_IN_AN_HOUR);
      this._minutes %= MINUTES_IN_AN_HOUR;
    }
  };
};
