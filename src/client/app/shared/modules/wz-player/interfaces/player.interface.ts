import { Frame } from '../../wazee-frame-formatter/index';

export type PlayerMode = 'basic' | 'advanced';

export interface PlayerState {
  readonly ready: boolean;
  readonly canSupportCustomControls: boolean;
  readonly playing: boolean;
  readonly playingMarkers: boolean;
  readonly playbackSpeed: number;
  readonly framesPerSecond: number;
  readonly currentFrame: Frame;
  readonly durationFrame: Frame;
  readonly inMarkerFrame: Frame;
  readonly outMarkerFrame: Frame;
  readonly volume: number;

  // This enables Angular change detection by making it clear that *something*
  // changed in the state.  (Change detection can't see that a nested object has
  // different data inside from one state to the next.)
  readonly changeDetectionEnabler: number;
}

export interface PlayerStateChanges {
  ready?: boolean;
  canSupportCustomControls?: boolean;
  playing?: boolean;
  playingMarkers?: boolean;
  playbackSpeed?: number;
  framesPerSecond?: number;
  currentFrame?: Frame;
  durationFrame?: Frame;
  inMarkerFrame?: Frame;
  outMarkerFrame?: Frame;
  volume?: number;

  // These properties are used to introduce Frame changes
  // based on information represented as other types.
  // "number" types without units in their names are
  // assumed to mean seconds.
  currentTime?: number;
  duration?: number;
  inMarker?: number;
  outMarker?: number;
  inMarkerFrameNumber?: number;
  outMarkerFrameNumber?: number;
}

export type MarkerType = 'in' | 'out';
export type PlaybackDirection = 'reverse' | 'forward';

export type ClearMarkersRequest = {
  type: 'CLEAR_MARKERS'
};

export type PlayAtSpeedRequest = {
  type: 'PLAY_AT_SPEED',
  speed: number,
  direction: PlaybackDirection
};

export type SeekToFrameRequest = {
  type: 'SEEK_TO_FRAME',
  frame: Frame
};

export type SeekToMarkerRequest = {
  type: 'SEEK_TO_MARKER',
  markerType: MarkerType
};

export type SetMarkerToCurrentFrameRequest = {
  type: 'SET_MARKER_TO_CURRENT_FRAME',
  markerType: MarkerType
};

export type SetVolumeRequest = {
  type: 'SET_VOLUME',
  volume: number
};

export type ToggleMarkersPlaybackRequest = {
  type: 'TOGGLE_MARKERS_PLAYBACK'
};

export type ToggleMuteRequest = {
  type: 'TOGGLE_MUTE'
};

export type TogglePlaybackRequest = {
  type: 'TOGGLE_PLAYBACK'
};

export type PlayerSeekRequest = SeekToFrameRequest | SeekToMarkerRequest;
export type PlayerVolumeRequest = SetVolumeRequest | ToggleMuteRequest;

export type PlayerRequest =
  PlayerSeekRequest |
  PlayerVolumeRequest |
  ClearMarkersRequest |
  PlayAtSpeedRequest |
  SetMarkerToCurrentFrameRequest |
  ToggleMarkersPlaybackRequest |
  TogglePlaybackRequest;
