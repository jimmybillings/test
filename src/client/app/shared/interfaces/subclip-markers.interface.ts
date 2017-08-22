import { Frame } from 'wazee-frame-formatter';

export interface Markers {
  startTime?: number;
  endTime?: number;
};

export interface SubclipMarkers {
  in?: Frame;
  out?: Frame;
}

export interface SerializedSubclipMarker {
  frameNumber: number;
  framesPerSecond: number;
}

export interface SerializedSubclipMarkers {
  in?: SerializedSubclipMarker;
  out?: SerializedSubclipMarker;
}

export function serialize(markers: SubclipMarkers): SerializedSubclipMarkers {
  if (!markers) return null;

  const serializedMarkers: SerializedSubclipMarkers = {};
  if (markers.in) serializedMarkers.in = serializeSingle(markers.in);
  if (markers.out) serializedMarkers.out = serializeSingle(markers.out);

  return serializedMarkers;
};

export function deserialize(serializedMarkers: SerializedSubclipMarkers): SubclipMarkers {
  if (!serializedMarkers) return null;

  const markers: SubclipMarkers = {};
  if (serializedMarkers.in) markers.in = deserializeSingle(serializedMarkers.in);
  if (serializedMarkers.out) markers.out = deserializeSingle(serializedMarkers.out);

  return markers;
}

export function timeStartFrom(markers: SubclipMarkers): number {
  return markers && markers.in ? toMilliseconds(markers.in) : -1;
}

export function timeEndFrom(markers: SubclipMarkers): number {
  return markers && markers.out ? toMilliseconds(markers.out) : -2;
}

function toMilliseconds(frame: Frame): number {
  return frame.asSeconds(3) * 1000;
}

function serializeSingle(marker: Frame): SerializedSubclipMarker {
  return { frameNumber: marker.frameNumber, framesPerSecond: marker.framesPerSecond };
}

function deserializeSingle(serializedMarker: SerializedSubclipMarker): Frame {
  return new Frame(serializedMarker.framesPerSecond).setFromFrameNumber(serializedMarker.frameNumber);
}
