import { Frame } from 'wazee-frame-formatter';

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

export type CLEAR_MARKERS = 'CLEAR_MARKERS';
export const CLEAR_MARKERS: CLEAR_MARKERS = 'CLEAR_MARKERS';
export type ClearMarkersRequest = {
  type: CLEAR_MARKERS
};

export type PLAY_AT_SPEED = 'PLAY_AT_SPEED';
export const PLAY_AT_SPEED: PLAY_AT_SPEED = 'PLAY_AT_SPEED';
export type PlayAtSpeedRequest = {
  type: PLAY_AT_SPEED,
  speed: number,
  direction: PlaybackDirection
};

export type SAVE_MARKERS = 'SAVE_MARKERS';
export const SAVE_MARKERS: SAVE_MARKERS = 'SAVE_MARKERS';
export type SaveMarkersRequest = {
  type: SAVE_MARKERS
};

export type SEEK_TO_FRAME = 'SEEK_TO_FRAME';
export const SEEK_TO_FRAME: SEEK_TO_FRAME = 'SEEK_TO_FRAME';
export type SeekToFrameRequest = {
  type: SEEK_TO_FRAME,
  frame: Frame
};

export type SEEK_TO_IN_MARKER = 'SEEK_TO_IN_MARKER';
export const SEEK_TO_IN_MARKER: SEEK_TO_IN_MARKER = 'SEEK_TO_IN_MARKER';
export type SeekToInMarkerRequest = {
  type: SEEK_TO_IN_MARKER
};

export type SEEK_TO_OUT_MARKER = 'SEEK_TO_OUT_MARKER';
export const SEEK_TO_OUT_MARKER: SEEK_TO_OUT_MARKER = 'SEEK_TO_OUT_MARKER';
export type SeekToOutMarkerRequest = {
  type: SEEK_TO_OUT_MARKER
};

export type SET_IN_MARKER = 'SET_IN_MARKER';
export const SET_IN_MARKER: SET_IN_MARKER = 'SET_IN_MARKER';
export type SetInMarkerRequest = {
  type: SET_IN_MARKER
};

export type SET_OUT_MARKER = 'SET_OUT_MARKER';
export const SET_OUT_MARKER: SET_OUT_MARKER = 'SET_OUT_MARKER';
export type SetOutMarkerRequest = {
  type: SET_OUT_MARKER
};

export type SET_VOLUME = 'SET_VOLUME';
export const SET_VOLUME: SET_VOLUME = 'SET_VOLUME';
export type SetVolumeRequest = {
  type: SET_VOLUME,
  volume: number
};

export type TOGGLE_MARKERS_PLAYBACK = 'TOGGLE_MARKERS_PLAYBACK';
export const TOGGLE_MARKERS_PLAYBACK: TOGGLE_MARKERS_PLAYBACK = 'TOGGLE_MARKERS_PLAYBACK';
export type ToggleMarkersPlaybackRequest = {
  type: TOGGLE_MARKERS_PLAYBACK
};

export type TOGGLE_MUTE = 'TOGGLE_MUTE';
export const TOGGLE_MUTE: TOGGLE_MUTE = 'TOGGLE_MUTE';
export type ToggleMuteRequest = {
  type: TOGGLE_MUTE
};

export type TOGGLE_PLAYBACK = 'TOGGLE_PLAYBACK';
export const TOGGLE_PLAYBACK: TOGGLE_PLAYBACK = 'TOGGLE_PLAYBACK';
export type TogglePlaybackRequest = {
  type: TOGGLE_PLAYBACK
};

export type PlayerRequest =
  ClearMarkersRequest |
  PlayAtSpeedRequest |
  SaveMarkersRequest |
  SeekToFrameRequest |
  SeekToInMarkerRequest |
  SeekToOutMarkerRequest |
  SetInMarkerRequest |
  SetOutMarkerRequest |
  SetVolumeRequest |
  ToggleMarkersPlaybackRequest |
  ToggleMuteRequest |
  TogglePlaybackRequest
