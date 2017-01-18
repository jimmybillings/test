import { Frame } from 'wazee-frame-formatter';

export type WzPlayerMode = 'basic' | 'advanced';

export interface WzPlayerState {
  readonly playing: boolean;
  readonly framesPerSecond: number;
  readonly currentFrame: Frame;
  readonly durationFrame: Frame;
  readonly inMarkerFrame: Frame;
  readonly outMarkerFrame: Frame;

  // This enables Angular change detection by making it clear that *something*
  // changed in the state.  (Change detection can't see that a nested object has
  // different data inside from one state to the next.)
  readonly changeDetectionEnabler: number;
}

export interface WzPlayerStateChanges {
  playing?: boolean;
  framesPerSecond?: number;
  currentFrame?: Frame;
  durationFrame?: Frame;
  inMarkerFrame?: Frame;
  outMarkerFrame?: Frame;

  // These properties are used to introduce Frame changes
  // based on information represented as other types.
  currentTime?: number;
  duration?: number;
  inMarker?: 'currentFrame' | 'clear';
  outMarker?: 'currentFrame' | 'clear';
}

export enum WzPlayerRequestType {
  ClearMarkers,
  PlayWithinMarkers,
  SeekToInMarker,
  SeekToOutMarker,
  SetInMarker,
  SetOutMarker,
  TogglePlayback
}

export interface WzPlayerRequest {
  type: WzPlayerRequestType;
  payload?: Object;
}
