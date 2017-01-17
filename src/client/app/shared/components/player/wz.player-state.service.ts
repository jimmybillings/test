import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { Frame } from 'wazee-frame-formatter';
import { WzPlayerState, WzPlayerStateChanges } from './wz.player.interface';

@Injectable()
export class WzPlayerStateService {
  private stateSubject: BehaviorSubject<WzPlayerState> = new BehaviorSubject(this.initialValue);

  public get state(): Observable<WzPlayerState> {
    return this.stateSubject.asObservable();
  }

  public get snapshot(): WzPlayerState {
    return this.stateSubject.getValue();
  }

  public updateWith(changes: WzPlayerStateChanges): void {
    this.stateSubject.next(this.createNewStateWith(changes));
  }

  private get initialValue(): WzPlayerState {
    return {
      playing: false,
      framesPerSecond: 29.97,
      currentFrame: undefined,
      durationFrame: undefined,
      inMarkerFrame: undefined,
      outMarkerFrame: undefined,
      changeDetectionEnabler: new Date().valueOf()
    };
  }

  private createNewStateWith(changes: WzPlayerStateChanges): WzPlayerState {
    const currentState: WzPlayerState = this.snapshot;
    const allChanges: WzPlayerStateChanges = this.handleInterdependenciesIn(changes, currentState);
    const framesPerSecond: number =
      allChanges.hasOwnProperty('framesPerSecond') ? allChanges.framesPerSecond : currentState.framesPerSecond;

    return {
      playing: allChanges.hasOwnProperty('playing') ? allChanges.playing : currentState.playing,
      framesPerSecond: framesPerSecond,
      currentFrame: this.newFrameFrom(allChanges.currentFrame || currentState.currentFrame, framesPerSecond),
      durationFrame: this.newFrameFrom(allChanges.durationFrame || currentState.durationFrame, framesPerSecond),
      inMarkerFrame: this.newFrameFrom((allChanges.inMarkerFrame as Frame) || currentState.inMarkerFrame, framesPerSecond),
      outMarkerFrame: this.newFrameFrom((allChanges.outMarkerFrame as Frame) || currentState.outMarkerFrame, framesPerSecond),
      changeDetectionEnabler: new Date().valueOf()
    };
  }

  private handleInterdependenciesIn(changes: WzPlayerStateChanges, currentState: WzPlayerState): WzPlayerStateChanges {
    const allChanges: WzPlayerStateChanges = JSON.parse(JSON.stringify(changes));
    const framesPerSecond: number =
      allChanges.hasOwnProperty('framesPerSecond') ? allChanges.framesPerSecond : currentState.framesPerSecond;

    if (allChanges.hasOwnProperty('currentTime')) {
      allChanges.currentFrame = new Frame(framesPerSecond).setFromSeconds(allChanges.currentTime);
      delete allChanges.currentTime;
    }

    if (allChanges.hasOwnProperty('duration')) {
      allChanges.durationFrame = new Frame(framesPerSecond).setFromSeconds(allChanges.duration);
      delete allChanges.duration;

      if (!currentState.inMarkerFrame) {
        allChanges.inMarkerFrame = new Frame(framesPerSecond).setFromFrameNumber(0);
      }

      if (!currentState.outMarkerFrame) {
        allChanges.outMarkerFrame = this.newFrameFrom(allChanges.durationFrame, framesPerSecond);
      }
    }

    if (allChanges.inMarker === 'currentFrame') {
      allChanges.inMarkerFrame = this.newFrameFrom(currentState.currentFrame, framesPerSecond);
    } else if (allChanges.inMarker === 'clear') {
      allChanges.inMarkerFrame = new Frame(framesPerSecond).setFromFrameNumber(0);
    }
    delete allChanges.inMarker;

    if (allChanges.outMarker === 'currentFrame') {
      allChanges.outMarkerFrame = this.newFrameFrom(currentState.currentFrame, framesPerSecond);
    } else if (allChanges.outMarker === 'clear') {
      allChanges.outMarkerFrame = this.newFrameFrom(allChanges.durationFrame || currentState.durationFrame, framesPerSecond);
    }
    delete allChanges.outMarker;

    if (allChanges.hasOwnProperty('inMarkerFrame') || allChanges.hasOwnProperty('outMarkerFrame')) {
      if (allChanges.hasOwnProperty('inMarkerFrame') && allChanges.hasOwnProperty('outMarkerFrame')) {
        if (allChanges.inMarkerFrame.frameNumber > allChanges.outMarkerFrame.frameNumber) {
          allChanges.outMarkerFrame.frameNumber = allChanges.inMarkerFrame.frameNumber;
        }
      } else if (allChanges.hasOwnProperty('inMarkerFrame')) {
        if (allChanges.inMarkerFrame.frameNumber > currentState.outMarkerFrame.frameNumber) {
          allChanges.outMarkerFrame = this.newFrameFrom(allChanges.inMarkerFrame, framesPerSecond);
        }
      } else {
        if (allChanges.outMarkerFrame.frameNumber < currentState.inMarkerFrame.frameNumber) {
          allChanges.inMarkerFrame = this.newFrameFrom(allChanges.outMarkerFrame, framesPerSecond);
        }
      }
    }

    return allChanges;
  }

  private newFrameFrom(otherFrame: Frame, framesPerSecond: number) {
    if (!otherFrame) return undefined;

    return new Frame(framesPerSecond).setFromFrameNumber(otherFrame.frameNumber);
  }
}
