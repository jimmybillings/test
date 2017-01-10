export type WzPlayerMode = 'basic' | 'advanced';

export interface WzPlayerState {
  readonly playing: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly inMarker: number;
  readonly outMarker: number;
}

export interface WzPlayerStateChanges {
  playing?: boolean;
  currentTime?: number;
  duration?: number;
  inMarker?: number | 'currentTime' | 'clear';
  outMarker?: number | 'currentTime' | 'clear';
}
