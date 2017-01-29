import { Frame } from 'wazee-frame-formatter';

export type PlayerMode = 'basic' | 'advanced';

export interface PlayerState {
  readonly playing: boolean;
  readonly playingMarkers: boolean;
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

export interface PlayerStateChanges {
  playing?: boolean;
  playingMarkers?: boolean;
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

export enum PlayerRequestType {
  ClearMarkers,
  SaveMarkers,
  SeekToInMarker,
  SeekToOutMarker,
  SetInMarker,
  SetOutMarker,
  ToggleMarkersPlayback,
  TogglePlayback
}

export interface PlayerRequest {
  type: PlayerRequestType;
  payload?: Object;
}

export type MarkerType = 'in' | 'out';
