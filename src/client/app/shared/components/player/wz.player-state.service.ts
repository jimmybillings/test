import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

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
    const allChanges: WzPlayerStateChanges = this.handleInterdependenciesIn(changes);
    const newState: WzPlayerState = Object.assign(this.initialValue, this.snapshot, allChanges);
    this.stateSubject.next(newState);
  }

  private get initialValue(): WzPlayerState {
    return {
      playing: false,
      currentTime: 0,
      duration: undefined,
      inMarker: 0,
      outMarker: undefined
    };
  }

  private handleInterdependenciesIn(changes: WzPlayerStateChanges): WzPlayerStateChanges {
    const allChanges: WzPlayerStateChanges = JSON.parse(JSON.stringify(changes));
    const currentState: WzPlayerState = this.stateSubject.getValue();

    if (allChanges.duration && !currentState.outMarker) {
      allChanges.outMarker = allChanges.duration;
    }

    if (allChanges.inMarker === 'currentTime') allChanges.inMarker = currentState.currentTime;
    if (allChanges.outMarker === 'currentTime') allChanges.outMarker = currentState.currentTime;

    if (allChanges.inMarker === 'clear') allChanges.inMarker = 0;
    if (allChanges.outMarker === 'clear') allChanges.outMarker = currentState.duration;

    if (allChanges.inMarker && allChanges.outMarker) {
      if (allChanges.inMarker > allChanges.outMarker) allChanges.outMarker = allChanges.inMarker;
    } else if (allChanges.inMarker) {
      if (allChanges.inMarker > currentState.outMarker) allChanges.outMarker = allChanges.inMarker;
    } else if (allChanges.outMarker) {
      if (allChanges.outMarker < currentState.inMarker) allChanges.inMarker = allChanges.outMarker;
    }

    return allChanges;
  }
}
