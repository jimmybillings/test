interface MockVideoCallbacks {
  [propertyName: string]: Function[];
}

export type MockVideoEventName = 'durationchange' | 'pause' | 'playing' | 'timeupdate' | 'seeked' | 'seeking';

export class MockVideoElement {
  public paused: boolean = false; // Assumes autoplay.

  private _currentTime: number = 0;
  private _duration: number = 0;
  private seekingTo: number = null;

  public play(): void {
    if (!this.paused) return;

    this.paused = false;
    this.trigger('playing');
  }

  public pause(): void {
    if (this.paused) return;

    this.paused = true;
    this.trigger('pause');
  }

  public get duration() {
    return this._duration;
  }

  public set currentTime(newTime: number) {
    this.seekingTo = newTime;
    this.trigger('seeking');
  }

  public get currentTime() {
    return this._currentTime;
  }

  public simulateDurationChangeTo(newDuration: number) {
    this._duration = newDuration;
    this.trigger('durationchange');
  }

  public simulateTimeChangeTo(newTime: number) {
    this._currentTime = newTime;
    this.trigger('timeupdate');
  }

  public simulateSeekCompletion() {
    if (!this.seekingTo) throw new Error('Tried to simulate seek completion, but not currently seeking!');

    this._currentTime = this.seekingTo;
    this.seekingTo = null;
    this.trigger('seeked');
    this.trigger('timeupdate');
  }

  public get numberOfDefinedEventCallbacks(): number {
    return Object.keys(this.eventCallbacks)
      .map(eventName => this.eventCallbacks[eventName].length)
      .reduce((a, b) => a + b, 0);
  }

  private eventCallbacks: MockVideoCallbacks = {
    durationchange: new Array<Function>(),
    pause: new Array<Function>(),
    playing: new Array<Function>(),
    timeupdate: new Array<Function>(),
    seeked: new Array<Function>(),
    seeking: new Array<Function>()
  };

  public on(eventName: MockVideoEventName, callback: Function): MockVideoElement {
    this.eventCallbacks[eventName].push(callback);
    return this;
  }

  public off(eventName: MockVideoEventName): MockVideoElement {
    this.eventCallbacks[eventName] = [];
    return this;
  }

  public trigger(eventName: MockVideoEventName): MockVideoElement {
    this.eventCallbacks[eventName].forEach((callback: Function) => callback());
    return this;
  }
}
