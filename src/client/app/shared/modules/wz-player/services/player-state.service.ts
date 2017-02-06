import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerStateChanges } from '../interfaces/player.interface';

@Injectable()
export class PlayerStateService {
  private stateSubject: BehaviorSubject<PlayerState> = new BehaviorSubject(this.initialValue);
  private changesToApply: PlayerStateChanges = {};

  public get state(): Observable<PlayerState> {
    return this.stateSubject.asObservable();
  }

  public get snapshot(): PlayerState {
    return this.stateSubject.getValue();
  }

  public updateWith(changes: PlayerStateChanges): void {
    this.stateSubject.next(this.createNewStateWith(changes));
  }

  public reset(): void {
    this.stateSubject.next(this.initialValue);
  }

  private get initialValue(): PlayerState {
    return {
      canSupportCustomControls: true,
      playing: false,
      playingMarkers: false,
      framesPerSecond: 29.97,
      currentFrame: undefined,
      durationFrame: undefined,
      inMarkerFrame: undefined,
      outMarkerFrame: undefined,
      changeDetectionEnabler: 0
    };
  }

  private createNewStateWith(requestedChanges: PlayerStateChanges): PlayerState {
    this.changesToApply = {};
    Object.keys(requestedChanges).forEach((key: string) => (<any>this.changesToApply)[key] = (<any>requestedChanges)[key]);
    this.handleChangeInterdependencies();

    return {
      canSupportCustomControls: this.latestCanSupportCustomControls,
      playing: this.latestPlaying,
      playingMarkers: this.latestPlayingMarkers,
      framesPerSecond: this.latestFramesPerSecond,
      currentFrame: this.newFrameFrom(this.latestCurrentFrame),
      durationFrame: this.newFrameFrom(this.latestDurationFrame),
      inMarkerFrame: this.newFrameFrom(this.latestInMarkerFrame),
      outMarkerFrame: this.newFrameFrom(this.latestOutMarkerFrame),
      changeDetectionEnabler: this.snapshot.changeDetectionEnabler + 1
    };
  }

  private handleChangeInterdependencies(): void {
    this.handleInMarkerFrameUpdate();
    this.handleOutMarkerFrameUpdate();
    this.handleCurrentTimeUpdate();
    this.handleDurationUpdate();
    this.handleInMarkerUpdate();
    this.handleOutMarkerUpdate();
    this.handleMarkerOrderingIssues();
  }

  private handleInMarkerFrameUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('inMarkerFrameNumber')) return;

    this.changesToApply.inMarkerFrame = this.newFrame.setFromFrameNumber(this.changesToApply.inMarkerFrameNumber);
    delete this.changesToApply.inMarkerFrameNumber;
  }

  private handleOutMarkerFrameUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('outMarkerFrameNumber')) return;

    this.changesToApply.outMarkerFrame = this.newFrame.setFromFrameNumber(this.changesToApply.outMarkerFrameNumber);
    delete this.changesToApply.outMarkerFrameNumber;
  }

  private handleCurrentTimeUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('currentTime')) return;

    this.changesToApply.currentFrame = this.newFrameFrom(this.changesToApply.currentTime);
    delete this.changesToApply.currentTime;
  }

  private handleDurationUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('duration')) return;

    this.changesToApply.durationFrame = this.newFrameFrom(this.changesToApply.duration);
    delete this.changesToApply.duration;
  }

  private handleInMarkerUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('inMarker')) return;

    this.changesToApply.inMarkerFrame = this.newFrameFrom(this.changesToApply.inMarker);
    delete this.changesToApply.inMarker;
  }

  private handleOutMarkerUpdate(): void {
    if (!this.changesToApply.hasOwnProperty('outMarker')) return;

    this.changesToApply.outMarkerFrame = this.newFrameFrom(this.changesToApply.outMarker);
    delete this.changesToApply.outMarker;
  }

  private handleMarkerOrderingIssues(): void {
    if (this.changesToApply.inMarkerFrame) {
      if (this.latestOutMarkerFrame && this.changesToApply.inMarkerFrame.frameNumber > this.latestOutMarkerFrame.frameNumber) {
        this.changesToApply.outMarkerFrame = this.newFrameFrom(this.changesToApply.inMarkerFrame);
      }
    } else if (this.changesToApply.outMarkerFrame) {
      if (this.latestInMarkerFrame && this.changesToApply.outMarkerFrame.frameNumber < this.latestInMarkerFrame.frameNumber) {
        this.changesToApply.inMarkerFrame = this.newFrameFrom(this.changesToApply.outMarkerFrame);
      }
    }
  }

  private get latestCanSupportCustomControls(): boolean {
    return this.changesToApply.hasOwnProperty('canSupportCustomControls')
      ? this.changesToApply.canSupportCustomControls
      : this.snapshot.canSupportCustomControls;
  }

  private get latestPlaying(): boolean {
    return this.changesToApply.hasOwnProperty('playing') ? this.changesToApply.playing : this.snapshot.playing;
  }

  private get latestPlayingMarkers(): boolean {
    return this.changesToApply.hasOwnProperty('playingMarkers') ? this.changesToApply.playingMarkers : this.snapshot.playingMarkers;
  }

  private get latestFramesPerSecond(): number {
    return this.changesToApply.hasOwnProperty('framesPerSecond') ? this.changesToApply.framesPerSecond : this.snapshot.framesPerSecond;
  }

  private get latestCurrentFrame(): Frame {
    return this.changesToApply.hasOwnProperty('currentFrame') ? this.changesToApply.currentFrame : this.snapshot.currentFrame;
  }

  private get latestDurationFrame(): Frame {
    return this.changesToApply.hasOwnProperty('durationFrame') ? this.changesToApply.durationFrame : this.snapshot.durationFrame;
  }

  private get latestInMarkerFrame(): Frame {
    return this.changesToApply.hasOwnProperty('inMarkerFrame') ? this.changesToApply.inMarkerFrame : this.snapshot.inMarkerFrame;
  }

  private get latestOutMarkerFrame(): Frame {
    return this.changesToApply.hasOwnProperty('outMarkerFrame') ? this.changesToApply.outMarkerFrame : this.snapshot.outMarkerFrame;
  }

  private newFrameFrom(input: number | Frame): Frame {
    if (typeof input === 'number') {
      return this.newFrame.setFromSeconds(input);
    } else if (!input) {
      return undefined;
    } else {
      return this.newFrame.setFromFrameNumber(input.frameNumber);
    }
  }

  private get newFrame(): Frame {
    return new Frame(this.latestFramesPerSecond);
  }
}
